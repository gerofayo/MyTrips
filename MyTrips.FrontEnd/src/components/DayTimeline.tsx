import { useState } from "react";
import type { BudgetItem } from "../types/BudgetItem";
import { Icon } from "@iconify/react";
import { getCategoryClass } from "../utils/category";
import { getDatePart } from "../utils/date";
import { TEXTS } from "../config/texts";
import "../styles/components/DayTimeline.css";
import "../styles/components/ExpenseCategoryColors.css";

interface DayTimelineProps {
  date: string;
  items: BudgetItem[];
  onEditItem: (item: BudgetItem) => void;
  onDeleteItem: (id: string) => void;
  onAddAtTime?: (hour: number) => void;
  onUpdateItemTime?: (id: string, newDate: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export const DayTimeline = ({
  date,
  items,
  onEditItem,
  onDeleteItem,
  onAddAtTime: _onAddAtTime,
  onUpdateItemTime: _onUpdateItemTime,
  isSubmitting,
}: DayTimelineProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const itemsByHour: Record<number, BudgetItem[]> = {};
  const unscheduledItems: BudgetItem[] = [];
  const selectedDateStr = date;

  items.forEach((item) => {
    const itemDateStr = getDatePart(item.date);
    
    if (itemDateStr === selectedDateStr) {
      const hasTime = item.time || (item.date?.includes('T') && !item.date.split('T')[1]?.startsWith('00:00:00'));
      
      if (hasTime) {
        let hour = -1;
        if (item.time) {
          hour = parseInt(item.time.split(':')[0], 10);
        } else {
          const timePart = item.date?.split('T')[1];
          if (timePart) hour = parseInt(timePart.split(':')[0], 10);
        }
        
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
          if (!itemsByHour[hour]) itemsByHour[hour] = [];
          itemsByHour[hour].push(item);
        } else {
          unscheduledItems.push(item);
        }
      } else {
        unscheduledItems.push(item);
      }
    } else {
      unscheduledItems.push(item);
    }
  });

  Object.keys(itemsByHour).forEach(hour => {
    itemsByHour[Number(hour)].sort((a, b) => {
      const timeA = a.time || a.date?.split('T')[1] || '';
      const timeB = b.time || b.date?.split('T')[1] || '';
      return timeA.localeCompare(timeB);
    });
  });

  const hoursWithItems = Object.keys(itemsByHour).map(Number).sort((a, b) => a - b);

  const formatHour = (hour: number): string => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const formatTimeDisplay = (item: BudgetItem): string => {
    if (item.time) {
      const [hours, minutes] = item.time.split(':');
      const hour = parseInt(hours, 10);
      const minute = minutes || '00';
      if (isNaN(hour)) return item.time;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minute.padStart(2, '0')} ${period}`;
    }
    return '';
  };

  const renderItem = (item: BudgetItem, showTime: boolean = false) => {
    const isExpanded = expandedItems.has(item.id);
    const hasDescription = item.description && item.description.trim().length > 0;
    const exactTime = formatTimeDisplay(item);

    const handleRowClick = () => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    };

    return (
      <div key={item.id} className={`budget-item ${isExpanded ? 'expanded' : ''}`}>
        <div className="budget-item-main" onClick={handleRowClick}>
          <div className={`budget-category-dot ${getCategoryClass(item.category)}`} />
          <div className="budget-item-content">
            {showTime && (
              <span className="budget-item-time">{exactTime}</span>
            )}
            <span className="budget-item-title">{item.title}</span>
          </div>
          <span className="budget-item-amount">${item.amount.toLocaleString()}</span>
          <div className="budget-item-actions">
            <button 
              className="budget-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick();
              }}
              title={isExpanded ? "Hide" : "Show"}
            >
              <Icon icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} />
            </button>
            <button 
              className="budget-action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditItem(item);
              }}
              title="Edit"
            >
              <Icon icon="mdi:pencil-outline" />
            </button>
            <button 
              className="budget-action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(item.id);
              }}
              disabled={isSubmitting}
              title="Delete"
            >
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="budget-item-expanded">
            {exactTime && <span className="expanded-time">{exactTime}</span>}
            {hasDescription && <span className="expanded-description">{item.description}</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="day-timeline">
      <div className="timeline-hours">
        {hoursWithItems.length > 0 ? (
          hoursWithItems.map((hour) => (
            <div key={hour} className="timeline-hour-slot">
              <div className="hour-label">
                <span className="hour-time">{formatHour(hour)}</span>
              </div>
              <div className="hour-content">
                {itemsByHour[hour]?.map((item) => renderItem(item, false))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-timeline">
            <Icon icon="mdi:calendar-blank" className="empty-icon" />
            <p>{TEXTS.dayTimeline.emptyTitle}</p>
            <p className="empty-hint">{TEXTS.dayTimeline.emptyHint}</p>
          </div>
        )}
      </div>

      {unscheduledItems.length > 0 && (
        <div className="unscheduled-section">
          <div className="unscheduled-header">
            <Icon icon="mdi:clock-outline" />
            <span>{TEXTS.dayTimeline.unscheduledTitle}</span>
          </div>
          <div className="category-items">
            {unscheduledItems.map(item => renderItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};

