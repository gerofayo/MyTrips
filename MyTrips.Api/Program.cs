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


// OpenAPI - disabled for Railway compatibility
// builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
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

// Use Railway's PORT environment variable (defaults to 8080)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();

