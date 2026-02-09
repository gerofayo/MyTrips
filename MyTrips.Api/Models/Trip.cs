using System;

namespace MyTrips.Api.Models;

public class Trip
{
    private const string DefaultCurrency = "USD";

    public Guid Id { get; private set; }

    public string Name { get; private set; } = null!;
    public string Destination { get; private set; } = null!;

    public DateOnly StartDate { get; private set; }
    public DateOnly EndDate { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public decimal Budget { get; private set; }
    public string Currency { get; private set; } = DefaultCurrency;

    private Trip() { }

    public Trip(
        string name,
        string destination,
        DateOnly startDate,
        DateOnly endDate,
        decimal budget,
        string currency = DefaultCurrency)
    {
        Validate(name, destination, startDate, endDate, budget);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Destination = destination.Trim();
        StartDate = startDate;
        EndDate = endDate;
        Budget = budget;
        Currency = string.IsNullOrWhiteSpace(currency)? DefaultCurrency: currency;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? name = null,
        string? destination = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        decimal? budget = null,
        string? currency = null)
    {
        var newName = name ?? Name;
        var newDestination = destination ?? Destination;
        var newStartDate = startDate ?? StartDate;
        var newEndDate = endDate ?? EndDate;
        var newBudget = budget ?? Budget;

        Validate(newName, newDestination, newStartDate, newEndDate, newBudget);

        Name = newName.Trim();
        Destination = newDestination.Trim();
        StartDate = newStartDate;
        EndDate = newEndDate;
        Budget = newBudget;
        if (!string.IsNullOrWhiteSpace(currency))
            Currency = currency;
        
    }

    private static void Validate(
        string name,
        string destination,
        DateOnly startDate,
        DateOnly endDate,
        decimal budget)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Trip name is required");

        if (string.IsNullOrWhiteSpace(destination))
            throw new ArgumentException("Destination is required");

        if (endDate < startDate)
            throw new ArgumentException("End date must be after start date");

        if (budget <= 0)
            throw new ArgumentException("Budget must be greater than zero");
    }
}

