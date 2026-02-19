using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.Trips;

public record class UpdateTripRequest
{
    public string? Title { get; set; }
    public string? Destination { get; set; }
    public string? DestinationTimeZone { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Budget { get; set; }
    public string? Currency { get; set; }
    public ICollection<UpdateBudgetItemRequest>? BudgetItems { get; set; }
}
