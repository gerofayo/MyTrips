using System;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

public class InMemoryTripRepository : ITripRepository
{
    private readonly List<Trip> _trips = new();

    public IEnumerable<Trip> GetAll()
        => _trips;

    public Trip? GetById(Guid id)
        => _trips.FirstOrDefault(t => t.Id == id);

    public void Add(Trip trip)
        => _trips.Add(trip);

    public void Update(Trip trip)
    {
        var index = _trips.FindIndex(t => t.Id == trip.Id);
        if (index != -1)
            _trips[index] = trip;
    }

    public void Delete(Guid id)
    {
        var trip = GetById(id);
        if (trip != null)
            _trips.Remove(trip);
    }
}
