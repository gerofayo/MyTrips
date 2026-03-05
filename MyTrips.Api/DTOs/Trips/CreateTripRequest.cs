using System.ComponentModel.DataAnnotations;
using MyTrips.Api.DTOs.BudgetItems;

namespace MyTrips.Api.DTOs;

public class CreateTripRequest
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Destination { get; set; } = string.Empty;

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Budget { get; set; }

    [Required]
    public string Currency { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    
    public ICollection<CreateBudgetItemRequest> BudgetItems { get; set; } = new List<CreateBudgetItemRequest>();

}

