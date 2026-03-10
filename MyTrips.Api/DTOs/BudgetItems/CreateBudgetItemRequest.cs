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
    public string? Date { get; set; }  // YYYY-MM-DD format - just the day
    public string? Time { get; set; }  // HH:MM format - just the time
    [Required]
    public bool IsEstimated { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; }
}
