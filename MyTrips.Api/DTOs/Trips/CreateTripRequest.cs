using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace MyTrips.Api.DTOs;

public record class CreateTripRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Destination { get; set; } = string.Empty;

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = string.Empty;

}
