using System.Text.Json.Serialization;
using MyTrips.Api.Enums;

namespace MyTrips.Api.Models;


public class Trip
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("destination")]
    public string Destination { get; set; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateOnly EndDate { get; set; }

    [JsonPropertyName("initialBudget")]
    public decimal InitialBudget { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = string.Empty;

    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("budgetItems")]
    public ICollection<BudgetItem> BudgetItems { get; set; } = new List<BudgetItem>();

    // Parameterless constructor required for JSON deserialization
    public Trip() { }

    public Trip(
        string title,
        string destination,
        DateOnly startDate,
        DateOnly endDate,
        decimal initialBudget,
        string currency,
        string? imageUrl = null
        )
    {
        Validate(title, destination, startDate, endDate, initialBudget, currency);

        Id = Guid.NewGuid();
        Title = title.Trim();
        Destination = destination.Trim();
        StartDate = startDate;
        EndDate = endDate;
        InitialBudget = initialBudget;
        Currency = currency;
        ImageUrl = imageUrl?.Trim();
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? title,
        string? destination,
        DateOnly? startDate,
        DateOnly? endDate,
        decimal? initialBudget,
        string? currency
        )
    {
        var newTitle = title?.Trim() ?? Title;
        var newDestination = destination?.Trim() ?? Destination;
        var newStartDate = startDate ?? StartDate;
        var newEndDate = endDate ?? EndDate;
        var newBudget = initialBudget ?? InitialBudget;
        var newCurrency = currency ?? Currency;

        Validate(newTitle, newDestination, newStartDate, newEndDate, newBudget, newCurrency);

        Title = newTitle;
        Destination = newDestination;
        StartDate = newStartDate;
        EndDate = newEndDate;
        InitialBudget = newBudget;
        Currency = newCurrency;
    }

    public BudgetItem AddBudgetItem(
        string title,
        decimal amount,
        ExpenseCategory category = ExpenseCategory.Other,
        bool isEstimated = true,
        DateTimeOffset? date = null,
        string? description = null)
    {
        var item = new BudgetItem(
            tripId: Id,
            title: title,
            category: category,
            amount: amount,
            isEstimated: isEstimated,
            date: date,
            description: description
            );

        BudgetItems.Add(item);

        return item;
    }

    public BudgetItem? GetBudgetItemById(Guid budgetItemId)
        => BudgetItems.FirstOrDefault(x => x.Id == budgetItemId);

    public BudgetItem? UpdateBudgetItem(
    Guid budgetItemId,
    string? title = null,
    ExpenseCategory? category = null,
    decimal? amount = null,
    bool? isEstimated = null,
    DateTimeOffset? date = null,
    string? description = null)
    {
        var item = GetBudgetItemById(budgetItemId);
        if (item is null)
            return null;

        var updatedItem = item.WithUpdates(title, category, amount, isEstimated, date, description);

        // Replace the item in the collection with the new immutable instance
        var index = BudgetItems.ToList().FindIndex(x => x.Id == budgetItemId);
        if (index >= 0)
        {
            BudgetItems.Remove(item);
            BudgetItems.Add(updatedItem);
        }

        return updatedItem;
    }

    public bool DeleteBudgetItem(Guid budgetItemId)
    {
        var item = BudgetItems.FirstOrDefault(x => x.Id == budgetItemId);
        if (item is null)
            return false;

        return BudgetItems.Remove(item);
    }

    public void UpdateImageUrl(string? imageUrl)
    {
        ImageUrl = imageUrl?.Trim();
    }

    public decimal GetTotalSpent()
        => BudgetItems
            .Where(x => !x.IsEstimated)
            .Sum(x => x.Amount);

    public decimal GetTotalEstimated()
        => BudgetItems
            .Where(x => x.IsEstimated)
            .Sum(x => x.Amount);

    public decimal GetProjectedTotal()
        => GetTotalSpent() + GetTotalEstimated();

    public decimal GetRemainingBudget()
        => InitialBudget - GetProjectedTotal();

    private void Validate(
        string title,
        string destination,
        DateOnly startDate,
        DateOnly endDate,
        decimal budget,
        string currency)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Trip title is required");

        if (string.IsNullOrWhiteSpace(destination))
            throw new ArgumentException("Destination is required");

        if (endDate < startDate)
            throw new ArgumentException("End date must be after start date");

        if (budget <= 0)
            throw new ArgumentException("Budget must be greater than zero");

        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Currency is required");
    }
}

