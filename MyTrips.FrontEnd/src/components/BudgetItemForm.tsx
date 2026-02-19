import { useEffect, useState } from "react";
import type { CreateBudgetItemRequest } from "../types/BudgetItem";
import { getBudgetItemCategories } from "../services/budgetItemService";

type Props = {
  onSubmit: (item: Omit<CreateBudgetItemRequest, "id">) => Promise<void>;
  isSubmitting: boolean;
  selectedDate: string | null;
};

export const BudgetItemForm = ({
  onSubmit,
  isSubmitting,
  selectedDate,
}: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [hasDate, setHasDate] = useState(!!selectedDate);

  const [formData, setFormData] = useState<CreateBudgetItemRequest>({
    title: "",
    amount: 0,
    category: "",
    isEstimated: false,
    date: selectedDate ?? null,
  });

  useEffect(() => {
    getBudgetItemCategories()
      .then(setCategories)
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === "" ? 0 : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: hasDate && formData.date ? new Date(formData.date).toISOString() : null,
    });

    setFormData({
      title: "",
      amount: 0,
      category: "",
      isEstimated: false,
      date: null,
    });
    setHasDate(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mini-form-card">
      
      <div className="inputgroup">
        <div style={{ flex: 2 }}>
          <label className="section-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Title</label>
          <input
            name="title"
            placeholder="e.g. Cinema Tickets"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="section-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Ammount</label>
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

      <div>
        <label className="section-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="checkbox-group">
        <input
          id="hasDate"
          type="checkbox"
          checked={hasDate}
          onChange={(e) => {
            setHasDate(e.target.checked);
            if (!e.target.checked) {
              setFormData(prev => ({ ...prev, date: null }));
            }
          }}
          style={{ width: 'auto' }} /* Evita que el checkbox ocupe el 100% */
        />
        <label htmlFor="hasDate" style={{ cursor: 'pointer', fontWeight: 500 }}>
          Asign specific date
        </label>
      </div>

      {/* Campo de fecha condicional con animación (si usas form-wrapper) */}
      {hasDate && (
        <div className="form-wrapper expanded">
          <label className="section-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Date</label>
          <input
            name="date"
            type="datetime-local"
            value={formData.date ?? ""}
            onChange={handleChange}
            required={hasDate}
          />
        </div>
      )}

      <button type="submit" disabled={isSubmitting} style={{ marginTop: '8px' }}>
        {isSubmitting ? "Saving..." : "Add to budget"}
      </button>
    </form>
  );
};