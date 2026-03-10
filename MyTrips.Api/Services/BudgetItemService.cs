using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Mappers;
using MyTrips.Api.Repositories;
using MyTrips.Api.Models;

namespace MyTrips.Api.Services;

public class BudgetItemService
{
    private readonly Func<Guid, ISessionRepository> _sessionRepositoryFactory;

    public BudgetItemService(Func<Guid, ISessionRepository> sessionRepositoryFactory)
    {
        _sessionRepositoryFactory = sessionRepositoryFactory;
    }

    private ISessionRepository GetRepository(Guid sessionId)
    {
        return _sessionRepositoryFactory(sessionId);
    }

    private Trip? GetTrip(Guid sessionId, Guid tripId)
    {
        var repository = GetRepository(sessionId);
        return repository.GetById(sessionId, tripId);
    }

    public BudgetItemResponse? CreateBudgetItem(Guid sessionId, Guid tripId, CreateBudgetItemRequest request)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, tripId);
        if (trip is null)
            return null;
        
        var budgetItem = trip.AddBudgetItem(
            title: request.Title,
            amount: request.Amount,
            category: request.Category,
            isEstimated: request.IsEstimated,
            date: request.Date,
            time: request.Time,
            description: request.Description
        );

        repository.Update(sessionId, trip);

        return BudgetItemMapper.ModelToResponse(budgetItem);
    }

    public IEnumerable<BudgetItemResponse>? GetAllBudgetItems(Guid sessionId, Guid tripId)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, tripId);
        if (trip is null)
            return null;

        return trip.BudgetItems
                   .Select(BudgetItemMapper.ModelToResponse);
    }

    public BudgetItemResponse? GetBudgetItemById(Guid sessionId, Guid tripId, Guid budgetItemId)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, tripId);
        if (trip is null)
            return null;

        var item = trip.GetBudgetItemById(budgetItemId);
        if (item is null)
            return null;

        return BudgetItemMapper.ModelToResponse(item);
    }

    public BudgetItemResponse? UpdateBudgetItem(Guid sessionId, Guid tripId, Guid budgetItemId, UpdateBudgetItemRequest request)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, tripId);
        if (trip is null)
            return null;

        var item = trip.UpdateBudgetItem(
            budgetItemId,
            title: request.Title,
            amount: request.Amount,
            category: request.Category,
            isEstimated: request.IsEstimated,
            date: request.Date,
            time: request.Time,
            description: request.Description
        );

        if (item is null)
            return null;

        repository.Update(sessionId, trip);

        return BudgetItemMapper.ModelToResponse(item);
    }

    public bool DeleteBudgetItem(Guid sessionId, Guid tripId, Guid budgetItemId)
    {
        var repository = GetRepository(sessionId);
        var trip = repository.GetById(sessionId, tripId);
        if (trip is null)
            return false;

        var removed = trip.DeleteBudgetItem(budgetItemId);
        if (!removed)
            return false;

        repository.Update(sessionId, trip);

        return true;
    }
}
