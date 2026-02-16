import { useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import { getCurrencies } from "../services/tripService";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
};

function TripForm({ onSubmit }: Props) {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateTripRequest>({
    destination: "",
    title: "",
    startDate: "",
    endDate: "",
    budget: 0,
    currency: "",
  });

  useEffect(() => {
    getCurrencies()
      .then(setCurrencies)
      .catch((err) => console.error("Error loading currencies:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name || e.target.id]: name === "budget" ? Number(value) : value,
    }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="title">Travel Name</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="endDate">End Date</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="budget">Budget</label>
        <input
          id="budget"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div>
        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
        >
          <option value="">Select a currency</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Add Trip</button>
    </form>
  );
}

export default TripForm;