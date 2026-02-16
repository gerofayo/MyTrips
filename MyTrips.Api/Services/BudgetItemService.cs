using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Mappers;
using MyTrips.Api.Repositories;
using MyTrips.Api.Models;

namespace MyTrips.Api.Services;

public class BudgetItemService
{
    private readonly ITripRepository _tripRepository;

    public BudgetItemService(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    private Trip? GetTrip(Guid tripId)
    {
        return _tripRepository.GetById(tripId);
    }

    public BudgetItemResponse? CreateBudgetItem(Guid tripId, CreateBudgetItemRequest request)
    {
        var trip = GetTrip(tripId);
        if (trip is null)
            return null;

        var budgetItem = trip.AddBudgetItem(
            title: request.Title,
            amount: request.Amount,
            category: request.Category,
            isEstimated: request.IsEstimated,
            date: request.Date
        );

        _tripRepository.Update(trip);

        return BudgetItemMapper.ModelToResponse(budgetItem);
    }

    public IEnumerable<BudgetItemResponse>? GetAllBudgetItems(Guid tripId)
    {
        var trip = GetTrip(tripId);
        if (trip is null)
            return null;

        return trip.BudgetItems
                   .Select(BudgetItemMapper.ModelToResponse);
    }

    public BudgetItemResponse? GetBudgetItemById(Guid tripId, Guid budgetItemId)
    {
        var trip = GetTrip(tripId);
        if (trip is null)
            return null;

        var item = trip.GetBudgetItemById(budgetItemId);
        if (item is null)
            return null;

        return BudgetItemMapper.ModelToResponse(item);
    }

    public BudgetItemResponse? UpdateBudgetItem(Guid tripId, Guid budgetItemId, UpdateBudgetItemRequest request)
    {
        var trip = GetTrip(tripId);
        if (trip is null)
            return null;

        var item = trip.UpdateBudgetItem(
            budgetItemId,
            title: request.Title,
            amount: request.Amount,
            category: request.Category,
            isEstimated: request.IsEstimated,
            date: request.Date
        );

        if (item is null)
            return null;

        _tripRepository.Update(trip);

        return BudgetItemMapper.ModelToResponse(item);
    }

    public bool DeleteBudgetItem(Guid tripId, Guid budgetItemId)
    {
        var trip = GetTrip(tripId);
        if (trip is null)
            return false;

        var removed = trip.DeleteBudgetItem(budgetItemId);
        if (!removed)
            return false;

        _tripRepository.Update(trip);

        return true;
    }
}
