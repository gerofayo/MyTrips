import type { BudgetItem } from "../types/BudgetItem";
import { useMemo, useState } from "react";
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleDescription = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const groupedData = useMemo(() => {
    const grouped: Record<string, BudgetItem[]> = {};

    items.forEach((item) => {
      let dateKey: string = TEXTS.budgetItemList.unscheduledKey;
      if (item.date) {
        // Parse as UTC for consistent date handling
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
        // Use UTC timestamp for consistent sorting
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
    // Use UTC parsing for consistent date handling
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
                <div key={item.id} className={`budget-item-card ${expandedItems.has(item.id) ? 'expanded' : ''}`}>
                  <div className="item-main">
                    <div className={`category-indicator ${getCategoryClass(item.category)}`} />
                    <div className="item-details">
                      <div 
                        className={`item-name-container ${item.description ? 'clickable' : ''}`}
                        onClick={() => item.description && toggleDescription(item.id)}
                        title={item.description ? "Click to view details" : undefined}
                      >
                        <p className="item-name">{item.title}</p>
                        {item.description && (
                          <div className="description-indicator">
                            <Icon icon="mdi:chevron-down" />
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <div className={`item-description ${expandedItems.has(item.id) ? 'expanded' : 'collapsed'}`}>
                          <div className="description-content">
                            <span className="description-label">Details:</span>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      )}
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
                        <Icon icon="mdi:pencil" />
                      </button>
                      <button 
                        className="action-btn-delete" 
                        onClick={() => onDelete(item.id)}
                        disabled={isSubmitting}
                        title="Delete"
                      >
                        <Icon icon="mdi:trash-can" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="form-container itinerary-empty-state">
          <p className="section-label">
            {TEXTS.budgetItemList.emptySelection}
          </p>
        </div>
      )}
    </div>
  );
};

