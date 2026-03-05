using MyTrips.Api.Repositories;
using MyTrips.Api.Services;

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

// Session-based repository (scoped per user, no central persistence)
var sessionManager = new SessionManager(TimeSpan.FromMinutes(30));
builder.Services.AddSingleton<SessionManager>(sessionManager);
builder.Services.AddSingleton<SessionTripRepository>();
builder.Services.AddSingleton<ISessionRepository>(sp => sp.GetRequiredService<SessionTripRepository>());

// Factory for creating session repositories
builder.Services.AddScoped<Func<Guid, ISessionRepository>>(sp =>
{
    var sessionRepository = sp.GetRequiredService<SessionTripRepository>();
    return sessionId => sessionRepository;
});

builder.Services.AddScoped<TripService>();
builder.Services.AddScoped<BudgetItemService>();

// CORS - Use environment variable for allowed origins (comma-separated)
// In Development: default to localhost:5173
// In Production: require CORS_ALLOWED_ORIGINS environment variable
var isDevelopment = builder.Environment.IsDevelopment();
var allowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"] 
    ?? (isDevelopment ? "http://localhost:5173" : "");

var corsOrigins = allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries)
    .Select(o => o.Trim())
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            if (corsOrigins.Length > 0)
            {
                policy.WithOrigins(corsOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            }
            else
            {
                // Fallback: allow any origin in production if not configured
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            }
        });
});

var app = builder.Build();

// =======================
// Middleware
// =======================

app.UseCors("AllowFrontend");


if (app.Environment.IsDevelopment())
{
    // Swagger disabled for Railway compatibility
}

// HTTPS - Comment out for production (Railway handles SSL)
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

// Health check endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Controllers
app.MapControllers();

// Use Railway's PORT environment variable (defaults to 8080 in production)
// In development, use the port from launchSettings.json (5234)
var port = Environment.GetEnvironmentVariable("PORT");
if (string.IsNullOrEmpty(port) && !app.Environment.IsProduction())
{
    port = "5234";
}
else if (string.IsNullOrEmpty(port))
{
    port = "8080";
}
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();

