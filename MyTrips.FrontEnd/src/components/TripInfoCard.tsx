import type { TripResponse } from "../types/Trip";
import "../styles/components/TripInfoCard.css";
import "../styles/components/ExpenseCategoryColors.css";
import { TEXTS } from "../config/texts";
import { getCategoryClass } from "../utils/category";

interface Props {
  trip: Pick<TripResponse, 'budget' | 'currency'>;
  items: Array<{
    amount: number;
    category: string;
  }>;
}

export const TripInfoCard = ({ trip, items }: Props) => {
  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);
  const remaining = trip.budget - totalSpent;
  const isOverBudget = remaining < 0;
  const spentPercentage = Math.min((totalSpent / trip.budget) * 100, 100);

  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="trip-info-card">
      <div className="budget-summary">
        
        <div className="budget-header">
          <div>
            <span className="section-label">{TEXTS.tripInfoCard.remainingBudgetLabel}</span>
            <h2 className={`budget-remaining-value ${isOverBudget ? 'over-budget' : ''}`}>
              ${remaining.toLocaleString()} {trip.currency}
            </h2>
          </div>
          <div>
            <span className="section-label">{TEXTS.tripInfoCard.totalSpentLabel}</span>
            <p className="total-spent-value">${totalSpent.toLocaleString()} {trip.currency}</p>
          </div>
        </div>

        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${isOverBudget ? 'danger' : ''}`}
            style={{ width: `${spentPercentage}%` }} 
          />
        </div>

        <span className="section-label">{TEXTS.tripInfoCard.categoryBreakdownLabel}</span>
        
        <div className="category-distribution-bar">
          {totalSpent > 0
            ? Object.entries(categories).map(([cat, amount]) => (
                <div
                  key={cat}
                  className={getCategoryClass(cat)}
                  style={{ width: `${(amount / totalSpent) * 100}%` }}
                  title={`${cat}: ${amount}`}
                />
              ))
            : (
              <div
                className="progress-bar-container"
                style={{ width: "100%", marginBottom: 0 }}
              />
            )}
        </div>

        <div className="category-legend">
          {items.length > 0
            ? Object.entries(categories).map(([cat, amount]) => (
                <div key={cat} className="legend-item">
                  <span className={`legend-dot ${getCategoryClass(cat)}`} />
                  <span className="cat-name">{cat}</span>
                  <span className="cat-amount">
                    {((amount / totalSpent) * 100).toFixed(0)}%
                  </span>
                </div>
              ))
            : (
              <p
                className="cat-name"
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                {TEXTS.tripInfoCard.noExpensesText}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};