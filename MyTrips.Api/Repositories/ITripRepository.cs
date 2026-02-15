using System;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

public interface ITripRepository
{
    IEnumerable<Trip> GetAll();
    Trip? GetById(Guid id);
    void Add(Trip trip);
    void Update(Trip trip);
    void Delete(Guid id);
}