using System;
using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Models;

namespace MyTrips.Api.Mappers;

public static class BudgetItemMapper
{
    public static BudgetItemResponse ModelToResponse(BudgetItem model)
    {
        return new BudgetItemResponse
        {
            Id = model.Id,
            Title = model.Title,
            Amount = model.Amount,
            Category = model.Category,
            IsEstimated = model.IsEstimated,
            Date = model.Date
        };
    }

    public static BudgetItem ResponseToModel(CreateBudgetItemRequest request, Guid tripId)
    {
        return new BudgetItem(
            tripId: tripId,
            title: request.Title,
            category: request.Category,
            amount: request.Amount,
            isEstimated: request.IsEstimated,
            date: request.Date
        );
    }
}
