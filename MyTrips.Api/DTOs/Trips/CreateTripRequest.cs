using System.ComponentModel.DataAnnotations;

namespace MyTrips.Api.DTOs;

public record class CreateTripRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
    [Required]

    public DateOnly StartDate { get; set; }
    [Required]

    public DateOnly EndDate { get; set; }
    [Range(0.01, double.MaxValue)]

    public decimal Budget { get; set; }

}
