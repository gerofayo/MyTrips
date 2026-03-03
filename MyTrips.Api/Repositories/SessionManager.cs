using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

/// <summary>
/// Manages user sessions for isolated data storage.
/// Each session has its own list of trips and budget items.
/// </summary>
public class SessionManager
{
    private readonly ConcurrentDictionary<Guid, UserSession> _sessions = new();
    private readonly TimeSpan _sessionTimeout;

    public SessionManager(TimeSpan? sessionTimeout = null)
    {
        _sessionTimeout = sessionTimeout ?? TimeSpan.FromMinutes(30);
    }

    /// <summary>
    /// Gets or creates a session by ID.
    /// </summary>
    public UserSession GetOrCreateSession(Guid sessionId)
    {
        return _sessions.GetOrAdd(sessionId, _ => new UserSession());
    }

    /// <summary>
    /// Gets a session if it exists, otherwise returns null.
    /// </summary>
    public UserSession? GetSession(Guid sessionId)
    {
        if (_sessions.TryGetValue(sessionId, out var session))
        {
            session.LastActivity = DateTime.UtcNow;
            return session;
        }
        return null;
    }

    /// <summary>
    /// Creates a new session and returns its ID.
    /// </summary>
    public Guid CreateSession()
    {
        var sessionId = Guid.NewGuid();
        _sessions.TryAdd(sessionId, new UserSession());
        return sessionId;
    }

    /// <summary>
    /// Removes a session.
    /// </summary>
    public bool RemoveSession(Guid sessionId)
    {
        return _sessions.TryRemove(sessionId, out _);
    }

    /// <summary>
    /// Cleans up expired sessions.
    /// </summary>
    public int CleanupExpiredSessions()
    {
        var expiredSessions = new List<Guid>();
        var now = DateTime.UtcNow;

        foreach (var kvp in _sessions)
        {
            if (now - kvp.Value.LastActivity > _sessionTimeout)
            {
                expiredSessions.Add(kvp.Key);
            }
        }

        foreach (var sessionId in expiredSessions)
        {
            _sessions.TryRemove(sessionId, out _);
        }

        return expiredSessions.Count;
    }
}

/// <summary>
/// Represents a user session with isolated trip data.
/// </summary>
public class UserSession
{
    public Guid Id { get; set; }
    public List<Trip> Trips { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivity { get; set; }

    public UserSession()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        LastActivity = DateTime.UtcNow;
    }
}

