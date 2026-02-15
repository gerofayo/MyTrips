using System;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Models;

namespace MyTrips.Api.Mappers;

public static class TripMapper
{
    public static TripResponse ModelToResponse(Trip trip)
    {
        return new TripResponse
        {
            Id = trip.Id,
            Title = trip.Title,
            Destination = trip.Destination,
            StartDate = trip.StartDate,
            EndDate = trip.EndDate,
            Budget = trip.InitialBudget,
            Currency = trip.Currency
        };
    }

    public static Trip ResponseToModel(CreateTripRequest request)
    {
        return new Trip(
            title: request.Title,
            destination: request.Destination,
            startDate: request.StartDate,
            endDate: request.EndDate,
            initialBudget: request.Budget,
            currency: request.Currency
        );
    }

}
