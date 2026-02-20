import { useEffect, useState } from "react";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { getBudgetItemCategories } from "../services/budgetItemService";

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
    
    if (selectedDate) {
      setIsPerDay(false);
      setDaysCount(1);
    }
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
      <div className="inputgroup">
        <div style={{ flex: 2 }}>
          <label className="section-label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>Title</label>
          <input
            name="title"
            placeholder="e.g. Daily Meals"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="section-label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>
            {isPerDay ? "Price p/Day" : "Amount"}
          </label>
          <input
            name="amount"
            type="number"
            value={formData.amount === 0 ? "" : formData.amount}
            placeholder="$ 0.00"
            min={0}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className="section-label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category...</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        {!selectedDate && !initialData && (
          <div style={{ paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="perDay" 
              checked={isPerDay} 
              onChange={(e) => setIsPerDay(e.target.checked)} 
            />
            <label htmlFor="perDay" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Per day?</label>
          </div>
        )}
      </div>

      {isPerDay && (
        <div className="form-wrapper expanded" style={{ background: '#f0f0ff', padding: '12px', borderRadius: '8px' }}>
          <label className="section-label" style={{ fontSize: "0.75rem" }}>How many days?</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="number" 
              min={1} 
              value={daysCount} 
              onChange={(e) => setDaysCount(Number(e.target.value))} 
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
              Total: ${(formData.amount * daysCount).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {(selectedDate || initialData?.date) && (
        <div className="form-wrapper expanded">
          <label className="section-label" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
      )}

      <button type="submit" disabled={isSubmitting} style={{ marginTop: "8px" }}>
        {isSubmitting ? "Saving..." : initialData ? "Update Item" : "Add to budget"}
      </button>
    </form>
  );
};