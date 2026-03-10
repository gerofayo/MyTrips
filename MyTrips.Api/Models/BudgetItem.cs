namespace MyTrips.Api.Models;

using System.Text.Json.Serialization;
using MyTrips.Api.Enums;

public class BudgetItem
{
    public Guid Id { get; set; }

    public Guid TripId { get; set; }

    // JsonIgnore prevents circular reference when serializing to JSON
    [JsonIgnore]
    public Trip Trip { get; private set; } = null!;

    public string Title { get; set; } = null!;
    public ExpenseCategory Category { get; set; }

    public decimal Amount { get; set; }

    public bool IsEstimated { get; set; }

    // Store as plain strings to avoid timezone issues
    public string? Date { get; set; }  // YYYY-MM-DD format - just the day
    public string? Time { get; set; }  // HH:MM format - just the time

    public DateTime CreatedAt { get; set; }

    public string? Description { get; set; }

    // Parameterless constructor required for JSON deserialization
    public BudgetItem() { }

    [JsonConstructor]
    public BudgetItem(
        Guid tripId,
        string title,
        ExpenseCategory category,
        decimal amount,
        bool isEstimated,
        string? date = null,
        string? time = null,
        string? description = null)
    {

        Validate(title, category, amount);

        Id = Guid.NewGuid();
        TripId = tripId;
        Title = title.Trim();
        Category = category;
        Amount = amount;
        IsEstimated = isEstimated;
        Date = date;
        Time = time;
        CreatedAt = DateTime.UtcNow;
        Description = description?.Trim();
    }

    public void MarkAsReal()
    {
        IsEstimated = false;
    }
    
    public BudgetItem WithUpdates(
        string? title = null,
        ExpenseCategory? category = null,
        decimal? amount = null,
        bool? isEstimated = null,
        string? date = null,
        string? time = null,
        string? description = null)
    {
        var newTitle = title ?? Title;
        var newCategory = category ?? Category;
        var newAmount = amount ?? Amount;

        Validate(newTitle, newCategory, newAmount);

        return new BudgetItem(
            TripId,
            title?.Trim() ?? Title,
            category ?? Category,
            amount ?? Amount,
            isEstimated ?? IsEstimated,
            date ?? Date,
            time ?? Time,
            description?.Trim() ?? Description
        );
    }

    public void Update(
        string? title,
        ExpenseCategory? category,
        decimal? amount,
        bool? isEstimated,
        string? date = null,
        string? time = null,
        string? description = null)
    {
        var newTitle = title ?? Title;
        var newCategory = category ?? Category;
        var newAmount = amount ?? Amount;

        Validate(newTitle, newCategory, newAmount);

        Title = newTitle?.Trim() ?? Title;
        Category = newCategory;
        Amount = newAmount;
        IsEstimated = isEstimated ?? IsEstimated;
        Date = date ?? Date;
        Time = time ?? Time;
        Description = description?.Trim() ?? Description;
    }

    private void Validate(
        string title,
        ExpenseCategory category,
        decimal amount)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required");

        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero");

        if (!Enum.IsDefined(typeof(ExpenseCategory), category))
            throw new ArgumentException("Invalid category");
    }
}
