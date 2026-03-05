using MyTrips.Api.DTOs.BudgetItems;

namespace MyTrips.Api.DTOs.Trips;

public class TripResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Currency { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public ICollection<BudgetItemResponse> BudgetItems { get; set; } = new List<BudgetItemResponse>();

}

