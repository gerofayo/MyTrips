namespace MyTrips.Api.DTOs.Trips;

public record class TripResponse
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Destination { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public decimal Budget { get; set; }
    public string? Currency { get; set; }

}
