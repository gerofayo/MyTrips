import type { BudgetItem } from "../types/BudgetItem";
import { useMemo } from "react";
import { Icon } from "@iconify/react";
import "../styles/components/BudgetItemList.css";
import "../styles/components/ExpenseCategoryColors.css";
import { TEXTS } from "../config/texts";
import { getCategoryClass } from "../utils/category";
import { parseDateAsUTC } from "../utils/date";

interface Props {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  onEdit: (item: BudgetItem) => void;
  isSubmitting: boolean;
  selectedDate?: string | null;
}

export const BudgetItemList = ({
  items,
  onDelete,
  onEdit,
  isSubmitting
}: Props) => {
  const groupedData = useMemo(() => {
    const grouped: Record<string, BudgetItem[]> = {};

    items.forEach((item) => {
      let dateKey: string = TEXTS.budgetItemList.unscheduledKey;
      if (item.date) {
        const date = new Date(item.date);
        dateKey = new Intl.DateTimeFormat("en-CA", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      }

      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      if (a === TEXTS.budgetItemList.unscheduledKey) return 1;
      if (b === TEXTS.budgetItemList.unscheduledKey) return -1;
      return a.localeCompare(b);
    });

    sortedDates.forEach((date) => {
      grouped[date].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
    });

    return { grouped, sortedDates };
  }, [items]);

  const getDayTotal = (dayItems: BudgetItem[]) =>
    dayItems.reduce((sum, i) => sum + i.amount, 0);

  const formatLongDate = (dateStr: string) => {
    if (dateStr === TEXTS.budgetItemList.unscheduledKey) {
      return TEXTS.budgetItemList.unscheduledTitle;
    }
    const date = parseDateAsUTC(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(date);
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(dateStr));
  };

  return (
    <div className="itinerary-list">
      {groupedData.sortedDates.length > 0 ? (
        groupedData.sortedDates.map((date) => (
          <div key={date} className="day-group">
            <div className="day-header">
              <div className="day-header-main">
                <span className="day-badge">
                  {date === TEXTS.budgetItemList.unscheduledKey
                    ? TEXTS.budgetItemList.badgeMisc
                    : TEXTS.budgetItemList.badgeDate}
                </span>
                <h4 className="day-title-text">
                  {formatLongDate(date)}
                </h4>
              </div>
              <div className="day-header-total">
                <span>
                  <strong>{TEXTS.budgetItemList.headerTotalLabel}:</strong>{" "}
                  ${getDayTotal(groupedData.grouped[date]).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="items-container">
              {groupedData.grouped[date].map((item) => (
                <div 
                  key={item.id} 
                  className={`budget-item-card ${date === TEXTS.budgetItemList.unscheduledKey ? 'generic' : ''}`}
                >
                  <div className="item-main">
                    <div className={`category-indicator ${getCategoryClass(item.category)}`} />
                    <div className="item-details">
                      <div className="item-name-container">
                        <p className="item-name">{item.title}</p>
                      </div>
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
                        <Icon icon="mdi:pencil-outline" />
                      </button>
                      <button 
                        className="action-btn-delete" 
                        onClick={() => onDelete(item.id)}
                        disabled={isSubmitting}
                        title="Delete"
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="itinerary-empty-state">
          <p>{TEXTS.budgetItemList.emptySelection}</p>
        </div>
      )}
    </div>
  );
};

