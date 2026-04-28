using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Models;
using Data;
using DTOs;


string GenerateJwtToken(User user, IConfiguration config)
{
    var claims = new[]
    {
        new Claim (ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, "Admin")
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: null,
        audience: null,
        claims: claims,
        expires: DateTime.Now.AddHours(24),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=noise.db"));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// create admin
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        var admin = new User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}

app.UseCors("DevCorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// get all links from db
app.MapGet("/api/links", async (AppDbContext db) =>
{
    return await db.Links.ToListAsync();
});

// post entry to db
app.MapPost("/api/links", async (AppDbContext db, LinkCreateDto linkDto) =>
{
    var newLink = new Link {
        Title = linkDto.Title,
        Url = linkDto.Url,
        Icon = linkDto.Icon
    };

    db.Links.Add(newLink);
    await db.SaveChangesAsync();
    return Results.Created($"/api/links/{newLink.Id}", newLink);
});

// update entry in db
app.MapPut("/api/links/{id}", async (int id, LinkCreateDto linkDto, AppDbContext db) =>
{
    var link = await db.Links.FindAsync(id);

    if (link is null) return Results.NotFound($"Link with ID {id} not found.");

    link.Title = linkDto.Title;
    link.Url = linkDto.Url;
    link.Icon = linkDto.Icon;

    await db.SaveChangesAsync();

    return Results.Ok(link);
});

// remove entry
app.MapDelete("/api/links/{id}", async (int id, AppDbContext db) =>
{
    var link = await db.Links.FindAsync(id);

    if (link is null) return Results.NotFound($"Link with ID {id} not found.");

    db.Links.Remove(link);

    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Link {id} deleted successfully." });
});


app.MapPost("/api/login", async (LoginDto loginDto, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

    if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
    {
        Console.WriteLine("e: " + loginDto.Password +" "+ user.PasswordHash);
        Console.WriteLine("verify: " + BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash));
        return Results.Unauthorized();
    }

    var token = GenerateJwtToken(user, config);

    return Results.Ok(new { 
        token = token, 
        username = user.Username,
        mustChangePassword = user.MustChangePassword 
    });
});

app.Run();
