using MyTrips.Api.Repositories;
using MyTrips.Api.Services;
using Swashbuckle.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Services
// =======================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

// Use in-memory repository (no file persistence)
// Export/Import functionality is available via API endpoints
builder.Services.AddSingleton<ITripRepository, InMemoryTripRepository>();
builder.Services.AddScoped<TripService>();
builder.Services.AddScoped<BudgetItemService>();


// OpenAPI with Swagger
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "https://mytrips-frontend.vercel.app"
            )
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
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS - Comment out for production (Railway handles SSL)
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

// Controllers
app.MapControllers();

// Use Railway's PORT environment variable (defaults to 8080)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
