using System;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Models;

namespace MyTrips.Api.Mappers;

public static class TripMapper
{
    public static TripResponse ToResponse(Trip trip)
    {
        return new TripResponse
        {
            Id = trip.Id,
            Name = trip.Name,
            Destination = trip.Destination,
            StartDate = trip.StartDate,
            EndDate = trip.EndDate,
            Budget = trip.Budget,
            Currency = trip.Currency
        };
    }

    public static Trip ToModel(CreateTripRequest request)
    {
        return new Trip(
            name: request.Name,
            destination: request.Destination,
            startDate: request.StartDate,
            endDate: request.EndDate,
            budget: request.Budget,
            currency: request.Currency
        );
    }

}
