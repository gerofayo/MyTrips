import { useEffect, useState } from "react";
import type { CreateBudgetItemRequest } from "../types/BudgetItem";
import { getBudgetItemCategories } from "../services/budgetItemService";

type Props = {
  onSubmit: (item: Omit<CreateBudgetItemRequest, "id">) => Promise<void>;
  isSubmitting: boolean;
  selectedDate?: string | null;
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
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      date: hasDate && formData.date
        ? new Date(formData.date).toISOString()
        : null,
    });

    // reset
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

      <div className="input-group">
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label>Amount</label>
        <input
          name="amount"
          type="number"
          value={formData.amount === 0 ? "" : formData.amount}
          placeholder="0"
          min={0}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Checkbox */}
      <div className="input-group">
        <label>
          {" "}Has specific date
          <input
            type="checkbox"
            checked={hasDate}
            onChange={(e) => {
              setHasDate(e.target.checked);
              if (!e.target.checked) {
                setFormData(prev => ({ ...prev, date: null }));
              }
            }}
          />
        </label>
      </div>

      {/* Condicional */}
      {hasDate && (
        <div className="input-group">
          <label>Date & Time</label>
          <input
            name="date"
            type="datetime-local"
            value={formData.date ?? ""}
            onChange={handleChange}
          />
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Item"}
      </button>

    </form>
  );
};
