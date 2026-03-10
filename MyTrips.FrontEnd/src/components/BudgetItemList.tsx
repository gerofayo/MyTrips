import type { BudgetItem } from "../types/BudgetItem";
import { useMemo } from "react";
import { Icon } from "@iconify/react";
import "../styles/components/BudgetItemList.css";
import "../styles/components/ExpenseCategoryColors.css";
import { TEXTS } from "../config/texts";
import { getCategoryClass } from "../utils/category";
import { parseDateAsUTC } from "../utils/date";
import { logger } from "../utils/logger";

interface Props {
  items: BudgetItem[];
  onDelete: (id: string) => void;
  onEdit: (item: BudgetItem) => void;
  isSubmitting: boolean;
  selectedDate?: string | null;
}

interface BudgetItemCardProps {
  item: BudgetItem;
  onEdit: (item: BudgetItem) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  showTime?: boolean;
}

const formatTime = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(dateStr));
};

const BudgetItemCard = ({ item, onEdit, onDelete, isSubmitting, showTime = false }: BudgetItemCardProps) => (
  <div className="budget-item-card">
    <div className="item-main">
      <div className={`category-indicator ${getCategoryClass(item.category)}`} />
      <div className="item-details">
        <div className="item-name-container">
          <p className="item-name">{item.title}</p>
        </div>
        <div className="item-meta">
          <span className="item-tag">{item.category}</span>
          {showTime && item.date && (
            <span className="item-time">• {formatTime(item.date)}</span>
          )}
        </div>
      </div>
    </div>
    <div className="item-right">
      <span className="item-price">
        ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <div className="item-actions">
        <button className="action-btn-edit" onClick={() => onEdit(item)} title="Edit">
          <Icon icon="mdi:pencil-outline" />
        </button>
        <button className="action-btn-delete" onClick={() => onDelete(item.id)} disabled={isSubmitting} title="Delete">
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </div>
    </div>
  </div>
);

export const BudgetItemList = ({
  items,
  onDelete,
  onEdit,
  isSubmitting,
  selectedDate
}: Props) => {
  const isViewAll = selectedDate === null;

  logger.info("BudgetItemList rendering", { itemCount: items.length, selectedDate });

  const { groupedData, averageCategoryStats, genericItems } = useMemo(() => {
    const grouped: Record<string, BudgetItem[]> = {};
    const categoryStats: Record<string, Record<string, number>> = {};
    const genericList: BudgetItem[] = [];

    items.forEach((item) => {
      let dateKey: string = TEXTS.budgetItemList.unscheduledKey;
      if (item.date) {
        const date = new Date(item.date);
        dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
      }

      if (dateKey === TEXTS.budgetItemList.unscheduledKey) {
        genericList.push(item);
      } else {
        if (!categoryStats[dateKey]) categoryStats[dateKey] = {};
        if (!categoryStats[dateKey][item.category]) categoryStats[dateKey][item.category] = 0;
        categoryStats[dateKey][item.category] += item.amount;
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
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    });

    const daysWithData = Object.keys(categoryStats);
    const avgStats: Record<string, number> = {};
    
    if (daysWithData.length > 0) {
      daysWithData.forEach(date => {
        Object.entries(categoryStats[date]).forEach(([category, amount]) => {
          if (!avgStats[category]) avgStats[category] = 0;
          avgStats[category] += amount;
        });
      });
      const numDays = daysWithData.length;
      Object.keys(avgStats).forEach(category => { avgStats[category] = avgStats[category] / numDays; });
    }

    return { groupedData: { grouped, sortedDates }, averageCategoryStats: avgStats, genericItems: genericList };
  }, [items]);

  const getDayTotal = (dayItems: BudgetItem[]) => dayItems.reduce((sum, i) => sum + i.amount, 0);

  const formatLongDate = (dateStr: string) => {
    if (dateStr === TEXTS.budgetItemList.unscheduledKey) return TEXTS.budgetItemList.unscheduledTitle;
    const date = parseDateAsUTC(dateStr);
    return new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(date);
  };

  const renderGenericExpenses = () => {
    if (genericItems.length === 0) return null;
    return (
      <div className="day-group">
        <div className="day-header">
          <div className="day-header-main">
            <span className="day-badge">{TEXTS.budgetItemList.badgeMisc}</span>
            <h4 className="day-title-text">{TEXTS.budgetItemList.unscheduledTitle}</h4>
          </div>
          <div className="day-header-total">
            <span><strong>{TEXTS.budgetItemList.headerTotalLabel}:</strong> ${getDayTotal(genericItems).toLocaleString()}</span>
          </div>
        </div>
        <div className="items-container">
          {genericItems.map(item => <BudgetItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} isSubmitting={isSubmitting} />)}
        </div>
      </div>
    );
  };

  const renderAverageCategoryStats = () => {
    const categories = Object.entries(averageCategoryStats).sort((a, b) => b[1] - a[1]);
    const total = categories.reduce((sum, [, amount]) => sum + amount, 0);
    if (categories.length === 0) return null;
    return (
      <div className="day-group">
        <div className="day-header">
          <div className="day-header-main">
            <span className="day-badge">{TEXTS.budgetItemList.badgeAverage}</span>
            <h4 className="day-title-text">{TEXTS.budgetItemList.averageTitle}</h4>
          </div>
          <div className="day-header-total">
            <span><strong>{TEXTS.budgetItemList.headerTotalLabel}:</strong> ${total.toLocaleString()}</span>
          </div>
        </div>
        <div className="category-stats-grid">
          {categories.map(([category, amount]) => (
            <div key={category} className="category-stat-card">
              <div className="category-stat-header">
                <span className={`category-dot ${getCategoryClass(category)}`} />
                <span className="category-name">{category}</span>
              </div>
              <span className="category-amount">${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className="category-percent">({((amount / total) * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isViewAll) {
    return (
      <div className="itinerary-list">
        {renderGenericExpenses()}
        {renderAverageCategoryStats()}
      </div>
    );
  }

  return (
    <div className="itinerary-list">
      {groupedData.sortedDates.length > 0 ? (
        groupedData.sortedDates.map((date) => (
          <div key={date} className="day-group">
            <div className="day-header">
              <div className="day-header-main">
                <span className="day-badge">{date === TEXTS.budgetItemList.unscheduledKey ? TEXTS.budgetItemList.badgeMisc : TEXTS.budgetItemList.badgeDate}</span>
                <h4 className="day-title-text">{formatLongDate(date)}</h4>
              </div>
              <div className="day-header-total">
                <span><strong>{TEXTS.budgetItemList.headerTotalLabel}:</strong> ${getDayTotal(groupedData.grouped[date]).toLocaleString()}</span>
              </div>
            </div>
            <div className="items-container">
              {groupedData.grouped[date].map(item => (
                <BudgetItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} isSubmitting={isSubmitting} showTime />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="itinerary-empty-state"><p>{TEXTS.budgetItemList.emptySelection}</p></div>
      )}
    </div>
  );
};

