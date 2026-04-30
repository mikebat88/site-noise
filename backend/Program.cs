using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Data;
using backend.DTOs;


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

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

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
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("changeme"),
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
app.UseAuthentication();
app.UseAuthorization();


// admin login
app.MapPost("/api/login", async (LoginDto loginDto, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

    if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    var token = GenerateJwtToken(user, config);

    return Results.Ok(new { 
        token = token, 
        username = user.Username,
        mustChangePassword = user.MustChangePassword 
    });
});

app.MapPost("/api/admin/change-password", async (ChangePasswordDto dto, AppDbContext db, HttpContext context) =>
{
    // 1. Get the User ID from the JWT Claims
    // (Assuming you stored 'NameIdentifier' or 'sub' in your token)
    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null) return Results.Unauthorized();

    var userId = int.Parse(userIdClaim);
    var user = await db.Users.FindAsync(userId);

    if (user == null) return Results.NotFound("User not found.");

    // 2. Verify the CURRENT password first
    if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
    {
        return Results.BadRequest(new { message = "Current password is incorrect." });
    }

    // 3. Hash and save the NEW password
    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    
    // 4. Update status (if you have a 'MustChangePassword' flag)
    user.MustChangePassword = false;

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Password updated successfully." });
})
.RequireAuthorization(); // Important: Protect this route!


// get all albums from db
app.MapGet("/api/albums", async (AppDbContext db) =>
{
    return await db.Albums.ToListAsync();
});

// post album to db
app.MapPost("/api/albums", async (AppDbContext db, AddAlbumDTO albumDTO) =>
{
    var newAlbum= new Album {
        Title = albumDTO.Title,
        Cover = albumDTO.Cover,
        BuyLink = albumDTO.BuyLink,
        StreamLink = albumDTO.StreamLink
    };

    db.Albums.Add(newAlbum);
    await db.SaveChangesAsync();
    return Results.Created($"/api/albums/{newAlbum.Id}", newAlbum);
})
.RequireAuthorization();


// update entry in db
app.MapPut("/api/albums/{id}", async (int id, AddAlbumDTO albumDTO, AppDbContext db) =>
{
    var album = await db.Albums.FindAsync(id);

    if (album is null) return Results.NotFound($"Album with ID {id} not found.");

    album.Title = albumDTO.Title;
    album.Cover = albumDTO.Cover;
    album.BuyLink = albumDTO.BuyLink;
    album.StreamLink = albumDTO.StreamLink;

    await db.SaveChangesAsync();

    return Results.Ok(album);
})
.RequireAuthorization();;

// remove entry
app.MapDelete("/api/links/{id}", async (int id, AppDbContext db) =>
{
    var album = await db.Albums.FindAsync(id);

    if (album is null) return Results.NotFound($"Album with ID {id} not found.");

    db.Albums.Remove(album);

    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Album \"{album.Title}\" deleted successfully." });
})
.RequireAuthorization();;


app.Run();
