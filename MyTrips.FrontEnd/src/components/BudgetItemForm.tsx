import { useEffect, useState } from "react";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { getBudgetItemCategories } from "../services/budgetItemService";
import "../styles/components/BudgetItemForm.css";

type Props = {
  onSubmit: (item: Omit<CreateBudgetItemRequest, "id">) => Promise<void>;
  isSubmitting: boolean;
  selectedDate: string | null;
  initialData: BudgetItem | null;
};

export const BudgetItemForm = ({
  onSubmit,
  isSubmitting,
  selectedDate,
  initialData
}: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [isPerDay, setIsPerDay] = useState(false);
  const [daysCount, setDaysCount] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: "",
    isEstimated: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        isEstimated: initialData.isEstimated,
      });
      if (initialData.date) {
        const extractedTime = initialData.date.split("T")[1]?.substring(0, 5);
        setTime(extractedTime || "");
      }
      setIsPerDay(false); 
    } else {
      setFormData({ title: "", amount: 0, category: "", isEstimated: false });
      setTime("");
      setIsPerDay(false);
      setDaysCount(1);
    }
  }, [initialData, selectedDate]);

  useEffect(() => {
    getBudgetItemCategories()
      .then(setCategories)
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalIsoDate: string | null = null;
    const activeDate = selectedDate || (initialData?.date ? initialData.date.split("T")[0] : null);

    if (activeDate) {
      const timePart = time || "00:00";
      finalIsoDate = new Date(`${activeDate}T${timePart}:00`).toISOString();
    }

    const finalAmount = isPerDay ? formData.amount * daysCount : formData.amount;

    await onSubmit({
      ...formData,
      amount: finalAmount,
      date: finalIsoDate,
    });

    if (!initialData) {
      setFormData({ title: "", amount: 0, category: "", isEstimated: false });
      setTime("");
      setIsPerDay(false);
      setDaysCount(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mini-form-card">
      <div className="form-row">
        <div className="form-group">
          <label className="section-label">Title</label>
          <input
            name="title"
            className="form-input"
            placeholder="e.g. Daily Meals"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="section-label">
            {isPerDay ? "Price p/Day" : "Amount"}
          </label>
          <input
            name="amount"
            className="form-input"
            type="number"
            value={formData.amount === 0 ? "" : formData.amount}
            placeholder="$ 0.00"
            min={0}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="form-group">
          <label className="section-label">Category</label>
          <select 
            name="category" 
            className="form-input" 
            value={formData.category} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Category...</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {(selectedDate || initialData?.date) ? (
          <div className="form-group">
            <label className="section-label">Time</label>
            <input 
              type="time" 
              className="form-input" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>
        ) : !initialData && (
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="perDay" 
              checked={isPerDay} 
              onChange={(e) => setIsPerDay(e.target.checked)} 
            />
            <label htmlFor="perDay" style={{ fontWeight: 600, cursor: 'pointer' }}>Multi-day expense?</label>
          </div>
        )}
      </div>

      {isPerDay && (
        <div className="per-day-box">
          <label className="section-label">Duration</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="number" 
              className="form-input"
              min={1} 
              value={daysCount} 
              onChange={(e) => setDaysCount(Number(e.target.value))} 
              style={{ width: '100px' }}
            />
            <span className="total-preview">
              Total: ${(formData.amount * daysCount).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialData ? "Update Item" : "Add to budget"}
      </button>
    </form>
  );
};