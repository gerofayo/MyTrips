interface Props {
  trip: {
    budget: number;
    currency: string;
  };
  items: Array<{
    amount: number;
    category: string;
  }>;
}

export const TripInfoCard = ({ trip, items }: Props) => {
  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);
  const remaining = trip.budget - totalSpent;
  const spentPercentage = Math.min((totalSpent / trip.budget) * 100, 100);

  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="trip-info-card">
      <div className="budget-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
          <div className="budget-main-info">
            <span className="section-label" style={{ marginBottom: '4px' }}>Remaining Budget</span>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: remaining < 0 ? 'var(--danger)' : 'var(--text-main)' }}>
              ${remaining.toLocaleString()} {trip.currency}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="section-label" style={{ marginBottom: '4px' }}>Total Spent</span>
            <p style={{ margin: 0, fontWeight: 600 }}>${totalSpent.toLocaleString()} {trip.currency}</p>
          </div>
        </div>

        <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: `${spentPercentage}%`, 
              height: '100%', 
              background: remaining < 0 ? 'var(--danger)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
              transition: 'width 0.5s ease-out'
            }} 
          />
        </div>

        <span className="section-label">Category Breakdown</span>
        
        <div className="category-distribution-bar">
          {Object.entries(categories).map(([cat, amount]) => (
            <div className={`cat-${cat.toLowerCase()}`}
              key={cat}
              style={{ 
                width: `${(amount / totalSpent) * 100}%`, 
                height: '100%',
                transition: 'width 0.3s ease'
              }}
              title={`${cat}: ${amount}`}
            />
          ))}
        </div>
        <div className="category-legend">
          {Object.entries(categories).map(([cat, amount]) => (
            <div key={cat} className={`legend-item cat-${cat.toLowerCase()}`}>
              <span className={`dot cat-${cat.toLowerCase()}`}></span>
              <span className="cat-name" style={{ textTransform: 'capitalize' }}>{cat}</span>
              <span className="cat-amount">{((amount / totalSpent) * 100).toFixed(0)}%</span>
            </div>
          ))}
          {items.length === 0 && <p className="cat-name">No expenses recorded yet.</p>}
        </div>
      </div>
    </div>
  );
};