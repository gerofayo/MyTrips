var builder = WebApplication.CreateBuilder(args);

// =======================
// Services
// =======================

// Controllers
builder.Services.AddControllers();

// OpenAPI (nuevo enfoque .NET 8)
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


var app = builder.Build();

// =======================
// Middleware
// =======================

app.UseCors("AllowFrontend");


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// HTTPS
app.UseHttpsRedirection();

// Controllers
app.MapControllers();

app.Run();