import type { BudgetItem } from "../types/BudgetItem";

interface Props {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  isSubmitting: boolean;
}

export const BudgetItemList = ({ items, onDelete, isSubmitting }: Props) => {

  // Agrupar por día (normalizando DateTime)
  const grouped = items.reduce((acc, item) => {
    if (!item.date) {
      if (!acc["Sin fecha"]) acc["Sin fecha"] = [];
      acc["Sin fecha"].push(item);
      return acc;
    }

    const dateObj = new Date(item.date);
    const onlyDate = dateObj.toISOString().split("T")[0];

    if (!acc[onlyDate]) acc[onlyDate] = [];
    acc[onlyDate].push(item);

    return acc;
  }, {} as Record<string, BudgetItem[]>);

  // Ordenar items dentro de cada día por hora
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

  // Ordenar fechas
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === "Sin fecha") return 1;
    if (b === "Sin fecha") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const formatLongDate = (dateStr: string) => {
    if (dateStr === "Sin fecha") return dateStr;

    return new Date(dateStr).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return null;

    return new Date(dateStr).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="itinerary-list">
      {sortedDates.map(date => (
        <div key={date} className="day-group">
          <h4 className="day-title">
            {formatLongDate(date)}
          </h4>

          {grouped[date].map(item => (
            <div key={item.id} className="budget-item-row">
              
              <div className="item-info">
                <span className="item-category-icon">📍{item.category}</span>

                <div>
                  <p className="item-title">
                    {item.title}
                  </p>

                  <span className="item-category">
                    {item.date && (
                      <>
                        {" • "}
                        {formatTime(item.date)}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="item-actions">
                <span className="item-amount">
                  ${item.amount.toLocaleString()}
                </span>

                <button
                  className="delete-item-btn"
                  onClick={() => onDelete(item.id)}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
