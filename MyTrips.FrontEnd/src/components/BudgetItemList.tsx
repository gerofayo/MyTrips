import type { BudgetItem } from "../types/BudgetItem";
import { useMemo } from "react";

interface Props {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  destinationTimezone: string;
  selectedDate: string | null; 
}

export const BudgetItemList = ({ 
  items, 
  onDelete, 
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
    <div className="itinerary-list" style={{ marginTop: '24px' }}>
      {groupedData.sortedDates.length > 0 ? (
        groupedData.sortedDates.map((date) => (
          <div key={date} className="day-group" style={{ marginBottom: '32px' }}>
            <div className="day-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="day-badge" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                {date === "Unscheduled" ? "MISC" : "DATE"}
              </span>
              <h4 className="day-title-text" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {formatLongDate(date)}
              </h4>
            </div>

            <div className="items-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groupedData.grouped[date].map((item) => (
                <div key={item.id} className="budget-item-card">
                  <div className="item-main">
                    <div className={`category-indicator cat-${item.category.toLowerCase()}`} />
                    <div className="item-details">
                      <p className="item-name" style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{item.title}</p>
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

                  <div className="item-right" style={{ textAlign: 'right' }}>
                    <span className="item-price" style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      className="action-btn-delete"
                      onClick={() => onDelete(item.id)}
                      disabled={isSubmitting}
                      title="Delete"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', marginTop: '4px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="mini-form-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-label">No activities logged for this selection.</p>
        </div>
      )}
    </div>
  );
};