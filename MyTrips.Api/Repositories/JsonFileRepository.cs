using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

public class JsonFileRepository : ITripRepository
{
    private readonly string _filePath;
    private List<Trip> _trips;
    private readonly object _lock = new();

    public JsonFileRepository(string filePath = "trips.json")
    {
        _filePath = filePath;
        _trips = LoadFromFile();
    }

    private List<Trip> LoadFromFile()
    {
        if (!File.Exists(_filePath))
        {
            return new List<Trip>();
        }

        try
        {
            var json = File.ReadAllText(_filePath);
            var trips = JsonSerializer.Deserialize<List<Trip>>(json);
            return trips ?? new List<Trip>();
        }
        catch
        {
            return new List<Trip>();
        }
    }

    private void SaveToFile()
    {
        lock (_lock)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };
            var json = JsonSerializer.Serialize(_trips, options);
            File.WriteAllText(_filePath, json);
        }
    }

    public IEnumerable<Trip> GetAll()
        => _trips;

    public Trip? GetById(Guid id)
        => _trips.FirstOrDefault(t => t.Id == id);

    public void Add(Trip trip)
    {
        _trips.Add(trip);
        SaveToFile();
    }

    public void Update(Trip trip)
    {
        var index = _trips.FindIndex(t => t.Id == trip.Id);
        if (index != -1)
        {
            _trips[index] = trip;
            SaveToFile();
        }
    }

    public void Delete(Guid id)
    {
        var trip = GetById(id);
        if (trip != null)
        {
            _trips.Remove(trip);
            SaveToFile();
        }
    }

    public string Export()
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };
        return JsonSerializer.Serialize(_trips, options);
    }

    public void Import(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new ArgumentException("JSON content cannot be empty", nameof(json));

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
                var existingTrip = _trips.FirstOrDefault(t => t.Id == importedTrip.Id);
                if (existingTrip == null)
                {
                    _trips.Add(importedTrip);
                }
                else
                {
                    // Existing trip - merge budget items from both sides
                    var index = _trips.IndexOf(existingTrip);
                    var existingBudgetItems = existingTrip.BudgetItems?.ToList() ?? new List<BudgetItem>();
                    var importedBudgetItems = importedTrip.BudgetItems?.ToList() ?? new List<BudgetItem>();
                    
                    // Update trip with imported data
                    _trips[index] = importedTrip;
                    
                    // Merge budget items: add imported items that don't exist in current
                    var existingItemIds = existingBudgetItems.Select(b => b.Id).ToHashSet();
                    foreach (var importedItem in importedBudgetItems)
                    {
                        if (!existingItemIds.Contains(importedItem.Id))
                        {
                            existingBudgetItems.Add(importedItem);
                        }
                    }
                    
                    _trips[index].BudgetItems = existingBudgetItems;
                }
            }
            SaveToFile();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to import trips: {ex.Message}", ex);
        }
    }
}
