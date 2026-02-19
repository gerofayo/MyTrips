using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.Trips;

public record class TripResponse
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Destination { get; set; }
    public required string DestinationTimeZone { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public decimal Budget { get; set; }
    public required string Currency { get; set; }

    public ICollection<BudgetItemResponse> BudgetItems { get; set; } = new List<BudgetItemResponse>();

}
