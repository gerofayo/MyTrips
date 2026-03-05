using System;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Models;
using MyTrips.Api.Mappers;

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
            StartDate = trip.StartDate.ToString("yyyy-MM-dd"),
            EndDate = trip.EndDate.ToString("yyyy-MM-dd"),
            Budget = trip.InitialBudget,
            Currency = trip.Currency,
            ImageUrl = trip.ImageUrl,
            BudgetItems = trip.BudgetItems.Select(BudgetItemMapper.ModelToResponse).ToList(),
            CreatedAt = trip.CreatedAt.ToString("yyyy-MM-dd")
        };
    }

    public static Trip ResponseToModel(CreateTripRequest request)
    {
        var trip = new Trip(
            title: request.Title,
            destination: request.Destination,
            startDate: request.StartDate,
            endDate: request.EndDate,
            initialBudget: request.Budget,
            currency: request.Currency,
            imageUrl: request.ImageUrl
        );

        // Add initial budget items if provided
        if (request.BudgetItems?.Count > 0)
        {
            foreach (var itemRequest in request.BudgetItems)
            {
                trip.AddBudgetItem(
                    title: itemRequest.Title,
                    amount: itemRequest.Amount,
                    category: itemRequest.Category,
                    isEstimated: itemRequest.IsEstimated,
                    date: itemRequest.Date,
                    description: itemRequest.Description
                );
            }
        }

        return trip;
    }

}

