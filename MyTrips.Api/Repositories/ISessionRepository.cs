using System;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

/// <summary>
/// Interface for session-based trip repository.
/// Each user has isolated data within their session.
/// </summary>
public interface ISessionRepository
{
    /// <summary>
    /// Gets all trips for the current session.
    /// </summary>
    IEnumerable<Trip> GetAll(Guid sessionId);

    /// <summary>
    /// Gets a trip by ID for the current session.
    /// </summary>
    Trip? GetById(Guid sessionId, Guid tripId);

    /// <summary>
    /// Adds a trip to the current session.
    /// </summary>
    void Add(Guid sessionId, Trip trip);

    /// <summary>
    /// Updates a trip in the current session.
    /// </summary>
    void Update(Guid sessionId, Trip trip);

    /// <summary>
    /// Deletes a trip from the current session.
    /// </summary>
    void Delete(Guid sessionId, Guid tripId);

    /// <summary>
    /// Exports all trips from the current session as JSON.
    /// </summary>
    string Export(Guid sessionId);

    /// <summary>
    /// Imports trips from JSON into the current session.
    /// </summary>
    void Import(Guid sessionId, string json);

    /// <summary>
    /// Clears all data from the current session.
    /// </summary>
    void Clear(Guid sessionId);
}

