using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs;

public record class CreateTripRequest
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Destination { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DestinationTimeZone { get; set; } = "UTC";

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [Required]
    public Currency Currency { get; set; } 

    
    public ICollection<CreateBudgetItemRequest> BudgetItems { get; set; } = new List<CreateBudgetItemRequest>();

}
