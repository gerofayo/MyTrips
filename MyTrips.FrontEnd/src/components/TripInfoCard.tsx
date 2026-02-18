// Dentro de TripInfoCard.tsx
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
  
  // Agrupar gastos por categoría para el gráfico
  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  // Colores para las categorías
  const colors: Record<string, string> = {
    Transporte: '#6366f1',
    Alojamiento: '#8b5cf6',
    Comida: '#f59e0b',
    Actividades: '#10b981',
    Otros: '#6b7280'
  };

  return (
    <div className="trip-info-card">
      <div className="budget-summary">
        <div className="budget-main-info">
          <span>Presupuesto Restante</span>
          <h2>{(trip.budget - totalSpent).toLocaleString()} {trip.currency}</h2>
        </div>
        
        {/* Barra de Distribución (Mini Chart) */}
        <div className="category-distribution-bar">
          {Object.entries(categories).map(([cat, amount]) => (
            <div 
              key={cat}
              style={{ 
                width: `${(amount / totalSpent) * 100}%`, 
                backgroundColor: colors[cat] || colors.Otros,
                height: '100%'
              }}
              title={`${cat}: ${amount}`}
            />
          ))}
        </div>

        {/* Leyenda del gráfico */}
        <div className="category-legend">
          {Object.entries(categories).map(([cat, amount]) => (
            <div key={cat} className="legend-item">
              <span className="dot" style={{ backgroundColor: colors[cat] || colors.Otros }}></span>
              <span className="cat-name">{cat}</span>
              <span className="cat-amount">{((amount / totalSpent) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};