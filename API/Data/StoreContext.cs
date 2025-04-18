using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }

    public required DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole {Id = "5aa09e7f-5561-4e26-8174-062c23fb1474", Name = "Member", NormalizedName="MEMBER"},
                new IdentityRole {Id = "98e22599-78b8-474f-bf6a-a24dd26bd221", Name = "Admin", NormalizedName="ADMIN"}
            );
    }
}