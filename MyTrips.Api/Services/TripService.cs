using System;
using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Mappers;
using MyTrips.Api.Models;
using MyTrips.Api.Repositories;

namespace MyTrips.Api.Services;

public class TripService(ITripRepository tripRepository)
{
    private readonly ITripRepository _tripRepository = tripRepository;

    public TripResponse CreateTrip(CreateTripRequest request)
    {   
        var trip = TripMapper.ResponseToModel(request);
        _tripRepository.Add(trip);
        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public IEnumerable<TripResponse> GetAllTrips()
    {
        var trips = _tripRepository.GetAll();
        var response = trips.Select(TripMapper.ModelToResponse).ToList();
        return response;
    }

    public TripResponse? GetTripById(Guid id)
    {
        var trip = _tripRepository.GetById(id);
        if (trip is null)
            return null;

        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public TripResponse? UpdateTrip(Guid id, UpdateTripRequest request)
    {
        var trip = _tripRepository.GetById(id);
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
        
        _tripRepository.Update(trip);

        var response = TripMapper.ModelToResponse(trip);
        return response;
    }

    public bool DeleteTrip(Guid id)
    {
        var trip = _tripRepository.GetById(id);
        if (trip is null)
            return false;

        _tripRepository.Delete(id);
        return true;
    }

}
