using MyTrips.Api.Repositories;
using MyTrips.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Services
// =======================

// Controllers
builder.Services.AddControllers();

builder.Services.AddSingleton<ITripRepository>(provider => 
    new JsonFileRepository("trips.json"));
builder.Services.AddScoped<TripService>();
builder.Services.AddScoped<BudgetItemService>();


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

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
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