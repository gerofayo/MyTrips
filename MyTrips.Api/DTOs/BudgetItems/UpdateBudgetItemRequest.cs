using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.BudgetItems;

public record class UpdateBudgetItemRequest
{
    public string? Title { get; set; }
    public ExpenseCategory? Category { get; set; }
    public decimal? Amount { get; set; }
    public DateTime? Date { get; set; }
    public bool? IsEstimated { get; set; }

}
