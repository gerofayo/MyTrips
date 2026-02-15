using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.Trips;

public record class TripResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public decimal Budget { get; set; }
    public Currency Currency { get; set; }

    public ICollection<BudgetItemResponse> BudgetItems { get; set; } = new List<BudgetItemResponse>();

}
