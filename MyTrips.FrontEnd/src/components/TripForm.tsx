import { useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import { getCurrencies } from "../services/tripService";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
  initialData?: CreateTripRequest;
};

function TripForm({ onSubmit, initialData }: Props) {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateTripRequest>(
    initialData || {
      destination: "",
      title: "",
      startDate: "",
      endDate: "",
      budget: 0,
      currency: "",
    }
  );

  useEffect(() => {
    getCurrencies()
      .then(setCurrencies)
      .catch(err => console.error("Error loading currencies:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
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
        <label htmlFor="destination">Destination</label>
        <input 
          id="destination" 
          name="destination" 
          value={formData.destination} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div >
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
      </div>

      <div >
        <div >
          <label htmlFor="budget">Budget</label>
          <input 
            id="budget" 
            name="budget" 
            type="number"
            value={formData.budget === 0 ? "" : formData.budget} 
            onChange={handleChange} 
            min={0}
            placeholder="0"
            required 
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
            <option value="">Select...</option>
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit">
        {initialData ? "Update Trip" : "Add Trip"}
      </button>
    </form>
  );
}

export default TripForm;