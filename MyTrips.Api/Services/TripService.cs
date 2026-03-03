using System;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Mappers;
using MyTrips.Api.Models;
using MyTrips.Api.Repositories;

namespace MyTrips.Api.Services;

public class TripService
{
    private readonly Func<Guid, ISessionRepository> _sessionRepositoryFactory;

    public TripService(Func<Guid, ISessionRepository> sessionRepositoryFactory)
    {
        _sessionRepositoryFactory = sessionRepositoryFactory;
    }

    private ISessionRepository GetRepository(Guid sessionId)
    {
        return _sessionRepositoryFactory(sessionId);
    }

    public TripResponse CreateTrip(Guid sessionId, CreateTripRequest request)
    {   
        var repository = GetRepository(sessionId);
        var trip = TripMapper.ResponseToModel(request);
        repository.Add(sessionId, trip);
        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public IEnumerable<TripResponse> GetAllTrips(Guid sessionId)
    {
        var repository = GetRepository(sessionId);
        var trips = repository.GetAll(sessionId);
        var response = trips.Select(TripMapper.ModelToResponse).ToList();
        return response;
    }

    public TripResponse? GetTripById(Guid sessionId, Guid id)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, id);
        if (trip is null)
            return null;

        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public TripResponse? UpdateTrip(Guid sessionId, Guid id, CreateTripRequest request)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, id);
        if (trip is null)
            return null;

        trip.Update(
            title: request.Title,
            destination: request.Destination,
            destinationTimeZone: request.DestinationTimeZone,
            startDate: request.StartDate,
            endDate: request.EndDate,
            initialBudget: request.Budget,
            currency: request.Currency
        );

        if (request.ImageUrl is not null)
        {
            trip.UpdateImageUrl(request.ImageUrl);
        }
        
        repository.Update(sessionId, trip);

        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public bool DeleteTrip(Guid sessionId, Guid id)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, id);
        if (trip is null)
            return false;

        repository.Delete(sessionId, id);
        return true;
    }

}
