import { useEffect, useState, useMemo } from "react";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { getBudgetItemCategories } from "../services/budgetItemService";
import { TEXTS } from "../config/texts";
import { SearchableSelect, type SearchableSelectOption } from "./SearchableSelect";
import { useNumericInput } from "../hooks/useNumericInput";
import { Icon } from "@iconify/react";
import { logger } from "../utils/logger";
import "../styles/components/BudgetItemForm.css";

type Props = {
  onSubmit: (item: Omit<CreateBudgetItemRequest, "id"> | Omit<CreateBudgetItemRequest, "id">[]) => Promise<void>;
  isSubmitting: boolean;
  selectedDate: string | null;
  selectedTime?: string | null;
  initialData: BudgetItem | null;
  tripStartDate?: string;
  tripEndDate?: string;
};

type DateMode = "specific" | "allday" | "none";
type AmountMode = "single" | "perDay" | "repeat";

export const BudgetItemForm = ({
  onSubmit,
  isSubmitting,
  selectedDate,
  selectedTime,
  initialData,
  tripStartDate,
  tripEndDate,
}: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [dateMode, setDateMode] = useState<DateMode>("specific");
  const [amountMode, setAmountMode] = useState<AmountMode>("single");
  const [formDate, setFormDate] = useState<string>("");
  const [isPerDay, setIsPerDay] = useState(false);
  const [daysCountInput, setDaysCount, getDaysCount] = useNumericInput(1);
  
  // Repeat each day mode state
  const [repeatStartDate, setRepeatStartDate] = useState<string>("");
  const [repeatEndDate, setRepeatEndDate] = useState<string>("");

  // Calculate repeat days
  const repeatDays = useMemo(() => {
    if (!repeatStartDate || !repeatEndDate) return 0;
    const start = new Date(repeatStartDate);
    const end = new Date(repeatEndDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }, [repeatStartDate, repeatEndDate]);

  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: "",
    isEstimated: false,
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        isEstimated: initialData.isEstimated,
        description: initialData.description || "",
      });
      
      // Determine date mode from existing data
      if (!initialData.date) {
        setDateMode("none"); // No date
      } else if (!initialData.time) {
        setDateMode("allday"); // All day (has date but no time)
      } else {
        setDateMode("specific"); // Specific date and time
        setFormDate(initialData.date.split("T")[0]);
        setTime(initialData.time);
      }
    } else {
      // New item
      setFormData({ title: "", amount: 0, category: "", isEstimated: false, description: "" });
      setTime(selectedTime || "");
      
      // Default based on selected date
      if (selectedDate) {
        setDateMode("specific");
        setFormDate(selectedDate);
      } else {
        setDateMode("none");
      }
      setIsPerDay(false);
      setAmountMode("single");
      setDaysCount(1);
      // Set default repeat dates from trip dates
      if (tripStartDate) {
        setRepeatStartDate(tripStartDate);
      }
      if (tripEndDate) {
        setRepeatEndDate(tripEndDate);
      }
    }
  }, [initialData, selectedDate, selectedTime, tripStartDate, tripEndDate]);

  useEffect(() => {
    getBudgetItemCategories()
      .then(setCategories)
      .catch((err) => logger.error("Failed to fetch categories", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const categoryOptions: SearchableSelectOption[] = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalDate: string | null = null;
    let finalTime: string | null = null;

    if (dateMode === "specific" && formDate) {
      finalDate = formDate;
      finalTime = time || null;
    } else if (dateMode === "allday" && formDate) {
      finalDate = formDate;
      finalTime = null; // All day
    }
    // dateMode "none" means no date and no time (generic)

    // Repeat each day mode - create multiple items
    if (amountMode === "repeat" && repeatDays > 0 && tripStartDate && tripEndDate) {
      const items: Omit<CreateBudgetItemRequest, "id">[] = [];
      const start = new Date(repeatStartDate);
      const end = new Date(repeatEndDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        items.push({
          ...formData,
          date: dateStr,
          time: null, // Repeat items are all-day
        });
      }
      
      await onSubmit(items);
    } else {
      // Single or per-day mode
      const finalAmount = isPerDay ? formData.amount * getDaysCount() : formData.amount;

      await onSubmit({
        ...formData,
        amount: finalAmount,
        date: finalDate,
        time: finalTime,
      });
    }

    if (!initialData) {
      setFormData({ title: "", amount: 0, category: "", isEstimated: false, description: "" });
      setTime("");
      setDateMode(selectedDate ? "specific" : "none");
      setFormDate(selectedDate || "");
      setIsPerDay(false);
      setAmountMode("single");
      setDaysCount(1);
      if (tripStartDate) setRepeatStartDate(tripStartDate);
      if (tripEndDate) setRepeatEndDate(tripEndDate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mini-form-card">
      <div className="form-row">
        <div className="form-group">
          <label className="section-label">{TEXTS.budgetItemForm.titleLabel}</label>
          <input
            name="title"
            className="form-input"
            placeholder={TEXTS.budgetItemForm.titlePlaceholder}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="section-label">
            {amountMode === "perDay" || amountMode === "repeat" 
              ? TEXTS.budgetItemForm.amountPerDayLabel 
              : TEXTS.budgetItemForm.amountLabel}
          </label>
          <input
            name="amount"
            className="form-input"
            type="number"
            value={formData.amount || ""}
            placeholder={TEXTS.budgetItemForm.amountPlaceholder}
            min={0}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row budget-item-two-col">
        <div className="form-group">
          <label className="section-label">{TEXTS.budgetItemForm.categoryLabel}</label>
          <SearchableSelect
            options={categoryOptions}
            value={formData.category}
            onChange={handleCategoryChange}
            placeholder={TEXTS.budgetItemForm.categoryPlaceholder}
            required
          />
        </div>

        <div className="form-group">
          {/* Date mode selector */}
          <div className="date-mode-selector">
            <button
              type="button"
              className={`mode-btn ${dateMode === "specific" ? "active" : ""}`}
              onClick={() => setDateMode("specific")}
            >
              <Icon icon="mdi:calendar" />
              Date
            </button>
            <button
              type="button"
              className={`mode-btn ${dateMode === "allday" ? "active" : ""}`}
              onClick={() => setDateMode("allday")}
            >
              <Icon icon="mdi:calendar-clock" />
              All Day
            </button>
            <button
              type="button"
              className={`mode-btn ${dateMode === "none" ? "active" : ""}`}
              onClick={() => setDateMode("none")}
            >
              <Icon icon="mdi:calendar-remove" />
              None
            </button>
          </div>

          {/* Date picker - shown for specific or allday */}
          {(dateMode === "specific" || dateMode === "allday") && (
            <input 
              type="date" 
              className="form-input" 
              value={formDate} 
              onChange={(e) => setFormDate(e.target.value)}
              min={tripStartDate}
              max={tripEndDate}
            />
          )}

          {/* Time picker - shown only for specific */}
          {dateMode === "specific" && (
            <input 
              type="time" 
              className="form-input" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Amount mode selector - only show when no specific date is selected */}
      {dateMode === "none" && !initialData && (
        <div className="amount-mode-section">
          <div className="amount-mode-selector">
            <button
              type="button"
              className={`mode-btn ${amountMode === "single" ? "active" : ""}`}
              onClick={() => { setAmountMode("single"); setIsPerDay(false); }}
            >
              <Icon icon="mdi:cash" />
              Single
            </button>
            <button
              type="button"
              className={`mode-btn ${amountMode === "perDay" ? "active" : ""}`}
              onClick={() => { setAmountMode("perDay"); setIsPerDay(true); }}
            >
              <Icon icon="mdi:calculator" />
              Daily Rate
            </button>
            <button
              type="button"
              className={`mode-btn ${amountMode === "repeat" ? "active" : ""}`}
              onClick={() => { setAmountMode("repeat"); setIsPerDay(false); }}
            >
              <Icon icon="mdi:calendar-repeat" />
              Repeat Daily
            </button>
          </div>
          {amountMode === "single" && (
            <p className="amount-mode-hint">Add a single expense</p>
          )}
          {amountMode === "perDay" && (
            <p className="amount-mode-hint">{TEXTS.budgetItemForm.multiDayHelper}</p>
          )}
          {amountMode === "repeat" && (
            <p className="amount-mode-hint">{TEXTS.budgetItemForm.repeatDailyHelper}</p>
          )}
        </div>
      )}

      {/* Per Day mode options */}
      {amountMode === "perDay" && (
        <div className="per-day-box">
          <label className="section-label">{TEXTS.budgetItemForm.durationLabel}</label>
          <div className="budget-item-per-day-row">
            <input 
              type="number" 
              className="form-input budget-item-days-input"
              min={1} 
              value={daysCountInput} 
              onChange={setDaysCount} 
            />
            <span className="total-preview">
              {TEXTS.budgetItemForm.durationTotalPrefix}
              {(formData.amount * getDaysCount()).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Repeat each day mode options */}
      {amountMode === "repeat" && (
        <div className="repeat-box">
          <div className="repeat-dates-row">
            <div className="form-group">
              <label className="section-label">{TEXTS.budgetItemForm.repeatStartDateLabel}</label>
              <input 
                type="date" 
                className="form-input" 
                value={repeatStartDate} 
                onChange={(e) => setRepeatStartDate(e.target.value)}
                min={tripStartDate}
                max={tripEndDate}
              />
            </div>
            <div className="form-group">
              <label className="section-label">{TEXTS.budgetItemForm.repeatEndDateLabel}</label>
              <input 
                type="date" 
                className="form-input" 
                value={repeatEndDate} 
                onChange={(e) => setRepeatEndDate(e.target.value)}
                min={repeatStartDate || tripStartDate}
                max={tripEndDate}
              />
            </div>
          </div>
          <div className="repeat-preview">
            <span className="repeat-days-count">
              {repeatDays} {TEXTS.budgetItemForm.repeatDaysCount}
            </span>
            <span className="repeat-total">
              {TEXTS.budgetItemForm.repeatTotalItems}: {repeatDays} × {formData.amount.toLocaleString()} = {(repeatDays * formData.amount).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="section-label">{TEXTS.budgetItemForm.descriptionLabel}</label>
        <textarea
          name="description"
          className="form-input"
          placeholder={TEXTS.budgetItemForm.descriptionPlaceholder}
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting
            ? TEXTS.budgetItemForm.submitSaving
            : initialData
            ? TEXTS.budgetItemForm.submitUpdate
            : amountMode === "repeat" && repeatDays > 1
            ? `Add ${repeatDays} Items`
            : TEXTS.budgetItemForm.submitCreate}
        </button>
      </div>
    </form>
  );
};

