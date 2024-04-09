using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/users")]
[Produces("application/json")]
[Authorize]
public class UsersController : BaseApiController
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet] //  api/users
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<List<AppUser>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{id}")] //  api/users/id
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        //return Ok(await _context.Users.FindAsync(id));
        return await _context.Users.FindAsync(id);
    }
}
