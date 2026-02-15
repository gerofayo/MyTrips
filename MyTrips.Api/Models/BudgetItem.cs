namespace MyTrips.Api.Models;

using MyTrips.Api.Enums;

public class BudgetItem
{
    public Guid Id { get; private set; }

    public Guid TripId { get; private set; }
    public Trip Trip { get; private set; } = null!;

    public string Title { get; private set; } = null!;
    public ExpenseCategory Category { get; private set; }

    public decimal Amount { get; private set; }

    public bool IsEstimated { get; private set; }

    public DateOnly? Date { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public BudgetItem(
        Guid tripId,
        string title,
        ExpenseCategory category,
        decimal amount,
        bool isEstimated,
        DateOnly? date = null)
    {

        Validate(title, category, amount);

        Id = Guid.NewGuid();
        TripId = tripId;
        Title = title.Trim();
        Category = category;
        Amount = amount;
        IsEstimated = isEstimated;
        Date = date;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkAsReal()
    {
        IsEstimated = false;
    }

    public void Update(
        string title,
        ExpenseCategory category,
        decimal amount,
        bool isEstimated,
        DateOnly? date = null)
    {
        Validate(title, category, amount);

        Title = title.Trim();
        Category = category;
        Amount = amount;
        IsEstimated = isEstimated;
        Date = date;
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
