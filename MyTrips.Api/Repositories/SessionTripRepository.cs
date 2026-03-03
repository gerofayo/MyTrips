using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

/// <summary>
/// Session-based implementation of ITripRepository.
/// Each user has isolated data within their session.
/// </summary>
public class SessionTripRepository : ISessionRepository
{
    private readonly SessionManager _sessionManager;

    public SessionTripRepository(SessionManager sessionManager)
    {
        _sessionManager = sessionManager;
    }

    public IEnumerable<Trip> GetAll(Guid sessionId)
    {
        var session = _sessionManager.GetOrCreateSession(sessionId);
        return session.Trips.ToList();
    }

    public Trip? GetById(Guid sessionId, Guid tripId)
    {
        var session = _sessionManager.GetSession(sessionId);
        return session?.Trips.FirstOrDefault(t => t.Id == tripId);
    }

    public void Add(Guid sessionId, Trip trip)
    {
        var session = _sessionManager.GetOrCreateSession(sessionId);
        session.Trips.Add(trip);
    }

    public void Update(Guid sessionId, Trip trip)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session == null) return;

        var index = session.Trips.FindIndex(t => t.Id == trip.Id);
        if (index != -1)
        {
            session.Trips[index] = trip;
        }
    }

    public void Delete(Guid sessionId, Guid tripId)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session == null) return;

        var trip = session.Trips.FirstOrDefault(t => t.Id == tripId);
        if (trip != null)
        {
            session.Trips.Remove(trip);
        }
    }

    public string Export(Guid sessionId)
    {
        var session = _sessionManager.GetSession(sessionId);
        var trips = session?.Trips ?? new List<Trip>();

        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Serialize(trips, options);
    }

    public void Import(Guid sessionId, string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new ArgumentException("JSON content cannot be empty", nameof(json));

        var session = _sessionManager.GetOrCreateSession(sessionId);

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            var importedTrips = JsonSerializer.Deserialize<List<Trip>>(json, options);

            if (importedTrips == null)
                throw new InvalidOperationException("Failed to deserialize trips from JSON");

            // Merge trips, avoiding duplicates
            foreach (var importedTrip in importedTrips)
            {
                var existingTrip = session.Trips.FirstOrDefault(t => t.Id == importedTrip.Id);
                if (existingTrip == null)
                {
                    session.Trips.Add(importedTrip);
                }
                else
                {
                    // Existing trip - merge budget items
                    var index = session.Trips.IndexOf(existingTrip);
                    var existingBudgetItems = existingTrip.BudgetItems?.ToList() ?? new List<BudgetItem>();
                    var importedBudgetItems = importedTrip.BudgetItems?.ToList() ?? new List<BudgetItem>();

                    // Update trip with imported data
                    session.Trips[index] = importedTrip;

                    // Merge budget items: add imported items that don't exist in current
                    var existingItemIds = existingBudgetItems.Select(b => b.Id).ToHashSet();
                    foreach (var importedItem in importedBudgetItems)
                    {
                        if (!existingItemIds.Contains(importedItem.Id))
                        {
                            existingBudgetItems.Add(importedItem);
                        }
                    }

                    session.Trips[index].BudgetItems = existingBudgetItems;
                }
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to import trips: {ex.Message}", ex);
        }
    }

    public void Clear(Guid sessionId)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session != null)
        {
            session.Trips.Clear();
        }
    }
}

