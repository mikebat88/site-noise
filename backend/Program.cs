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
app.UseStaticFiles();


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

// verify if the admin is logged and whether the token is correct
app.MapGet("/api/verify", () => Results.Ok()).RequireAuthorization();


app.MapPost("/api/admin/change-password", async (ChangePasswordDto dto, AppDbContext db, HttpContext context) =>
{
    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null) return Results.Unauthorized();

    Console.WriteLine("pass: {0}", dto.OldPassword);

    var userId = int.Parse(userIdClaim);
    var user = await db.Users.FindAsync(userId);

    if (user == null) {
        return Results.NotFound("User not found.");
    }
    
    if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
    {
        return Results.BadRequest(new { message = "Current password is incorrect." });
    }

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    
    user.MustChangePassword = false;

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Password updated successfully." });
})
.RequireAuthorization();


// get all albums from db
app.MapGet("/api/albums", async (AppDbContext db) =>
{
    return await db.Albums
        .OrderByDescending(a => a.ReleaseDate)
        .ToListAsync();
});

// get a specific albums from db
app.MapGet("/api/album/{id}", async (int id, AppDbContext db) =>
{
    var album = await db.Albums.FindAsync(id);
    if (album is not null)
    {
        return Results.Ok(album);
    }
    else
    {
        return Results.NotFound();
    }
});

// post album to db
app.MapPost("/api/albums", async (HttpRequest request, AppDbContext db) =>
{

    var form = await request.ReadFormAsync();
    
    string title = form["Title"].ToString();
    string buyLink = form["BuyLink"].ToString();
    string streamLink = form["StreamLink"].ToString();
    
    if (!DateTime.TryParse(form["ReleaseDate"], out DateTime releaseDate))
    {
        releaseDate = DateTime.Now;
    }

    var file = form.Files["Cover"];
    string coverPath = "/covers/default.png";

    if (file != null && file.Length > 0)
    {
        // Ensure the directory exists
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "covers");
        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

        var filePath = Path.Combine(folderPath, file.FileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
        
        coverPath = $"/covers/{file.FileName}";
    }

    // 4. Create and Save
    var newAlbum = new Album {
        Title = title,
        Cover = coverPath,
        BuyLink = buyLink,
        StreamLink = streamLink,
        ReleaseDate = releaseDate
    };

    db.Albums.Add(newAlbum);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/albums/{newAlbum.Id}", newAlbum);
})
.RequireAuthorization();


// update album entry in db
app.MapPut("/api/albums/{id}", async (int id, HttpRequest request, AppDbContext db) =>
{
    var album = await db.Albums.FindAsync(id);
    if (album is null) return Results.NotFound();

    var form = await request.ReadFormAsync();
    
    // Update text fields
    album.Title = form["Title"].ToString();
    album.BuyLink = form["BuyLink"].ToString();
    album.StreamLink = form["StreamLink"].ToString();
    
    if (DateTime.TryParse(form["ReleaseDate"], out DateTime releaseDate)) album.ReleaseDate = releaseDate;

    // Handle Image
    var file = form.Files["Cover"];
    if (file != null && file.Length > 0)
    {
        // 2. Identify the OLD file path
        if (!string.IsNullOrEmpty(album.Cover))
        {
            // Combine the current directory with the relative path from the DB
            // We trim the leading slash from album.Cover to avoid path errors
            var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", album.Cover.TrimStart('/'));

            // 3. Delete the old file if it exists
            if (System.IO.File.Exists(oldFilePath))
            {
                System.IO.File.Delete(oldFilePath);
            }
        }
        
        // 2. Save new file
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "covers");
        var filePath = Path.Combine(folderPath, file.FileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
        
        album.Cover = $"/covers/{file.FileName}";
    }

    await db.SaveChangesAsync();
    return Results.Ok(album);
})
.RequireAuthorization();

// remove album entry
app.MapDelete("/api/albums/{id}", async (int id, AppDbContext db) =>
{
    var album = await db.Albums.FindAsync(id);

    if (album is null) return Results.NotFound($"Album with ID {id} not found.");

    db.Albums.Remove(album);

    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Album \"{album.Title}\" deleted successfully." });
})
.RequireAuthorization();;


app.Run();
