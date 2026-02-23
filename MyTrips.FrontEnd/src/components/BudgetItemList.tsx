import type { BudgetItem } from "../types/BudgetItem";
import { useMemo } from "react";
import "../styles/components/BudgetItemList.css";

interface Props {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  onEdit: (item: BudgetItem) => void;
  isSubmitting: boolean;
  destinationTimezone: string;
  selectedDate: string | null;
}

export const BudgetItemList = ({
  items,
  onDelete,
  onEdit,
  isSubmitting,
  destinationTimezone,
  selectedDate
}: Props) => {

  const groupedData = useMemo(() => {
    const grouped: Record<string, BudgetItem[]> = {};

    const filteredItems = selectedDate
      ? items.filter((item) => {
          if (!item.date) return false;
          const itemDateKey = new Intl.DateTimeFormat("en-CA", {
            timeZone: destinationTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(item.date));
          return itemDateKey === selectedDate;
        })
      : items;

    filteredItems.forEach((item) => {
      let dateKey = "Unscheduled";
      if (item.date) {
        dateKey = new Intl.DateTimeFormat("en-CA", {
          timeZone: destinationTimezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(item.date));
      }

      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      if (a === "Unscheduled") return 1;
      if (b === "Unscheduled") return -1;
      return a.localeCompare(b);
    });

    sortedDates.forEach((date) => {
      grouped[date].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    });

    return { grouped, sortedDates };
  }, [items, destinationTimezone, selectedDate]);

  const formatLongDate = (dateStr: string) => {
    if (dateStr === "Unscheduled") return "Unscheduled Expenses";
    const date = new Date(`${dateStr}T00:00:00`);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: destinationTimezone,
    }).format(date);
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: destinationTimezone,
    }).format(new Date(dateStr));
  };

  return (
    <div className="itinerary-list">
      {groupedData.sortedDates.length > 0 ? (
        groupedData.sortedDates.map((date) => (
          <div key={date} className="day-group">
            <div className="day-header">
              <span className="day-badge">
                {date === "Unscheduled" ? "MISC" : "DATE"}
              </span>
              <h4 className="day-title-text">
                {formatLongDate(date)}
              </h4>
            </div>

            <div className="items-container">
              {groupedData.grouped[date].map((item) => (
                <div key={item.id} className="budget-item-card">
                  <div className="item-main">
                    <div className={`category-indicator cat-${item.category.toLowerCase().replace(/\s+/g, '-')}`} />
                    <div className="item-details">
                      <p className="item-name">{item.title}</p>
                      <div className="item-meta">
                        <span className="item-tag">{item.category}</span>
                        {item.date && (
                          <span className="item-time">
                            • {formatTime(item.date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="item-right">
                    <span className="item-price">
                      ${item.amount.toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                    <div className="item-actions">
                      <button className="action-btn-edit" onClick={() => onEdit(item)} title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="action-btn-delete" 
                        onClick={() => onDelete(item.id)}
                        disabled={isSubmitting}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="form-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-label">No activities logged for this selection.</p>
        </div>
      )}
    </div>
  );
};