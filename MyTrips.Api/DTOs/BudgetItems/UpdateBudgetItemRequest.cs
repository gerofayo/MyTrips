using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.BudgetItems;

public record class UpdateBudgetItemRequest
{
    public string? Title { get; set; }
    public ExpenseCategory? Category { get; set; }
    public decimal? Amount { get; set; }
    public string? Date { get; set; }  // YYYY-MM-DD format - just the day
    public string? Time { get; set; }  // HH:MM format - just the time
    public bool? IsEstimated { get; set; }
    public string? Description { get; set; }
}
