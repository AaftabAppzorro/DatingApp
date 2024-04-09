using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseApiController
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]   //api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var IsUserAlreadyExisted = await _context.Users.AnyAsync(u => u.UserName ==registerDto.Username.ToLower());

            if(IsUserAlreadyExisted) return BadRequest("User already exist. Try login to your account.");

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = registerDto.Username,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]   //api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.Username);
            if(user == null) return Unauthorized("Invalid Username.");
            
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
                if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password.");

            return new UserDto
            {
                Username = loginDto.Username,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}