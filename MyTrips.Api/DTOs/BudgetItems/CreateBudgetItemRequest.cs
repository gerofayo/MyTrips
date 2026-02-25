using System.ComponentModel.DataAnnotations;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs.BudgetItems;

public record class CreateBudgetItemRequest
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public ExpenseCategory Category { get; set; }
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }
    public DateTimeOffset? Date { get; set; }
    [Required]
    public bool IsEstimated { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; }
}
