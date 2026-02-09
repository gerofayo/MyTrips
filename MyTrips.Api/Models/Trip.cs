using System;

namespace MyTrips.Api.Models;

public class Trip
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public DateOnly StartDate { get; private set; }
    public DateOnly EndDate { get; private set; }
    public decimal Budget { get; private set; }

    public Trip(string name, DateOnly startDate, DateOnly endDate, decimal budget)
    {
        if (endDate < startDate)
            throw new ArgumentException("End date must be after start date");

        if (budget <= 0)
            throw new ArgumentException("Budget must be greater than zero");

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty");

        Id = Guid.NewGuid();
        Name = name;
        StartDate = startDate;
        EndDate = endDate;
        Budget = budget;
    }

}
