namespace MyTrips.Api.Models;

using MyTrips.Api.Enums;


public class Trip
{
    private const Currency DefaultCurrency = Currency.USD;

    public Guid Id { get; private set; }

    public string Title { get; private set; } = null!;
    public string Destination { get; private set; } = null!;

    public DateOnly StartDate { get; private set; }
    public DateOnly EndDate { get; private set; }

    public decimal InitialBudget { get; private set; }
    public Currency Currency { get; private set; } = DefaultCurrency;

    public DateTime CreatedAt { get; private set; }

    public ICollection<BudgetItem> BudgetItems { get; private set; } = new List<BudgetItem>();

    public Trip(
        string title,
        string destination,
        DateOnly startDate,
        DateOnly endDate,
        decimal initialBudget,
        Currency currency = DefaultCurrency
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
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? title,
        string? destination,
        DateOnly? startDate,
        DateOnly? endDate,
        decimal? initialBudget,
        Currency? currency
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
        DateTime? date = null)
    {
        var item = new BudgetItem(
            tripId: Id,
            title: title,
            category: category,
            amount: amount,
            isEstimated: isEstimated,
            date: date
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
    DateTime? date = null)
    {
        var item = GetBudgetItemById(budgetItemId);
        if (item is null)
            return null;

        item.Update(title, category, amount, isEstimated, date);

        return item;
    }

    public bool DeleteBudgetItem(Guid budgetItemId)
    {
        var item = BudgetItems.FirstOrDefault(x => x.Id == budgetItemId);
        if (item is null)
            return false;

        return BudgetItems.Remove(item);
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
        Currency currency)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Trip title is required");

        if (string.IsNullOrWhiteSpace(destination))
            throw new ArgumentException("Destination is required");

        if (endDate < startDate)
            throw new ArgumentException("End date must be after start date");

        if (budget <= 0)
            throw new ArgumentException("Budget must be greater than zero");

        if (!Enum.IsDefined(typeof(Currency), currency))
            throw new ArgumentException("Invalid currency");
    }
}
