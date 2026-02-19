using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;

namespace MyTrips.Api.DTOs;

public record class CreateTripRequest
{
    [Required]
    [MaxLength(100)]
    public required string Title { get; set; }
    
    [Required]
    [MaxLength(100)]
    public required string Destination { get; set; }

    [Required]
    [MaxLength(100)]
    public required string DestinationTimeZone { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [Required]
    public required string Currency { get; set; }

    
    public ICollection<CreateBudgetItemRequest> BudgetItems { get; set; } = new List<CreateBudgetItemRequest>();

}
