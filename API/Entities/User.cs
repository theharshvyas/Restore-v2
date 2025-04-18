using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
    public int? AddresId { get; set; }
    public Address? Address { get; set; }
}
