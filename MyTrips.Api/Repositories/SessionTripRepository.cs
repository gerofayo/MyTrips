using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

/// <summary>
/// Custom JSON converter for DateOnly to handle ISO 8601 format (yyyy-MM-dd)
/// </summary>
public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var stringValue = reader.GetString();
            if (DateOnly.TryParse(stringValue, out var result))
            {
                return result;
            }
        }
        throw new JsonException($"Unable to deserialize DateOnly from {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("yyyy-MM-dd"));
    }
}

/// <summary>
/// Session-based implementation of ITripRepository.
/// Each user has isolated data within their session.
/// </summary>
public class SessionTripRepository : ISessionRepository
{
    private readonly SessionManager _sessionManager;

    // Shared JsonSerializerOptions with converters for DateOnly and enums
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = 
        { 
            new JsonStringEnumConverter(),
            new DateOnlyJsonConverter()
        }
    };

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
            var importedTrips = JsonSerializer.Deserialize<List<Trip>>(json, JsonOptions);

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

