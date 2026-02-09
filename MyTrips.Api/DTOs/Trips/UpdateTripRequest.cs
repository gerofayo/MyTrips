namespace MyTrips.Api.DTOs.Trips;

public record class UpdateTripRequest
{
    public string? Name { get; set; }
    public string? Destination { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Budget { get; set; }
    public string? Currency { get; set; }
}
