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
      {/* Stats Row - 3 Columns */}
      <div className="budget-stats">
        <div className="stat-item remaining">
          <span className="stat-label">{TEXTS.tripInfoCard.remainingBudgetLabel}</span>
          <span className={`stat-value ${isOverBudget ? 'over-budget' : ''}`}>
            ${remaining.toLocaleString()}
          </span>
          <span className="stat-currency">{trip.currency}</span>
        </div>
        
        <div className="stat-item spent">
          <span className="stat-label">{TEXTS.tripInfoCard.totalSpentLabel}</span>
          <span className="stat-value">
            ${totalSpent.toLocaleString()}
          </span>
          <span className="stat-currency">{trip.currency}</span>
        </div>
        
        <div className="stat-item total">
          <span className="stat-label">{TEXTS.tripInfoCard.totalBudgetLabel}</span>
          <span className="stat-value">
            ${trip.budget.toLocaleString()}
          </span>
          <span className="stat-currency">{trip.currency}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-labels">
          <span>{spentPercentage.toFixed(0)}{TEXTS.tripInfoCard.spentPercentageLabel}</span>
          <span className={isOverBudget ? 'text-danger' : ''}>
            {isOverBudget ? TEXTS.tripInfoCard.overBudgetText : `${(100 - spentPercentage).toFixed(0)}${TEXTS.tripInfoCard.remainingPercentageLabel}`}
          </span>
        </div>
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${isOverBudget ? 'danger' : ''}`}
            style={{ width: `${spentPercentage}%` }} 
          />
        </div>
      </div>

      {/* Category Distribution */}
      {items.length > 0 && (
        <div className="category-section">
          <span className="section-label">{TEXTS.tripInfoCard.categoryBreakdownLabel}</span>
          
          {/* Colored distribution bar */}
          <div className="category-distribution-bar">
            {Object.entries(categories).map(([cat, amount]) => (
              <div
                key={cat}
                className={`category-bar-fill ${getCategoryClass(cat)}`}
                style={{ width: `${(amount / totalSpent) * 100}%` }}
                title={`${cat}: $${amount.toLocaleString()}`}
              />
            ))}
          </div>
          
          {/* Category Legend - 3 columns */}
          <div className="category-legend">
            {Object.entries(categories).map(([cat, amount]) => (
              <div key={cat} className="legend-item">
                <span className={`legend-dot ${getCategoryClass(cat)}`} />
                <span className="cat-name">{cat}</span>
                <span className="cat-amount">
                  {((amount / totalSpent) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

