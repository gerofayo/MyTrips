using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.BudgetItems;

public record class BudgetItemResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public DateTimeOffset? Date { get; set; }
    public bool IsEstimated { get; set; }
    public string? Description { get; set; }
}
