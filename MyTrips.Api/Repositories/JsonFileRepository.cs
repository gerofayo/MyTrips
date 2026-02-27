using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using MyTrips.Api.Models;

namespace MyTrips.Api.Repositories;

public class JsonFileRepository : ITripRepository
{
    private readonly string _filePath;
    private List<Trip> _trips;

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
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };
        var json = JsonSerializer.Serialize(_trips, options);
        File.WriteAllText(_filePath, json);
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

    public void ImportFromFile(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"File not found: {filePath}");

        try
        {
            var json = File.ReadAllText(filePath);
            var importedTrips = JsonSerializer.Deserialize<List<Trip>>(json);
            
            if (importedTrips != null)
            {
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
                        // Update existing trip with imported data
                        var index = _trips.IndexOf(existingTrip);
                        _trips[index] = importedTrip;
                    }
                }
                SaveToFile();
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to import from file: {ex.Message}");
        }
    }

    public void ExportToFile(string filePath)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true
        };
        var json = JsonSerializer.Serialize(_trips, options);
        File.WriteAllText(filePath, json);
    }
}