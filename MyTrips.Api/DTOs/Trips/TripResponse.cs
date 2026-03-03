using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.Trips;

public record class TripResponse
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Destination { get; set; }
    public required string DestinationTimeZone { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public required string Currency { get; set; }

    public string? ImageUrl { get; set; }

    public ICollection<BudgetItemResponse> BudgetItems { get; set; } = new List<BudgetItemResponse>();

}
