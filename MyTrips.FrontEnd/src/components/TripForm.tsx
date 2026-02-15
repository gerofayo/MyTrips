import { useState } from "react";
import type { TripResponse } from "../types/Trip";

type Props = {
  onSubmit: (trip: Omit<TripResponse, "id">) => void;
};

function TripForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<Omit<TripResponse, "id">>({
    destination: "Hawaii",
    name: "Vacation to Hawaii",
    startDate: "",
    endDate: "",
    createdAt: "",
    budget: 0,
    currency: "USD",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: id === "budget" ? Number(value) : value,
    }));
  }

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
                value={formData.destination}
                onChange={handleChange} 
                required
            />
        </div>

        <div>
            <label htmlFor="name">Travel Name</label>
            <input id="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
            <label htmlFor="startDate">Start Date</label>
            <input
                id="startDate"
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
                type="number"
                value={formData.budget}
                onChange={handleChange}
                min={0}
            />
        </div>

        <div>
            <label htmlFor="currency">Currency</label>
            <input
                id="currency"
                value={formData.currency}
                onChange={handleChange}
            />
        </div>

        <button type="submit">Add Trip</button>
    </form>
  );
}

export default TripForm;
