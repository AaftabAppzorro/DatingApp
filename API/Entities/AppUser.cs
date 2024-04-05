namespace API.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public byte[] PsswordHash { get; set; }
    public byte[] PsswordSalt { get; set; }
}
