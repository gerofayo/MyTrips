import { useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import { getCurrencies } from "../services/tripService";
import {getAllCountries, getCountry} from "countries-and-timezones";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
  initialData?: CreateTripRequest;
};

function TripForm({ onSubmit, initialData }: Props) {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateTripRequest>(
    initialData || {
      destination: "",
      destinationTimezone: "",
      title: "",
      startDate: "",
      endDate: "",
      budget: 0,
      currency: "",
    }
  );
  const allCountries = Object.values(getAllCountries());

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const countryCode = e.target.value;
  const country = getCountry(countryCode);

  if (!country) return;

  const zones = country.timezones;

  setAvailableTimezones(zones);

  setFormData(prev => ({
    ...prev,
    destination: country.name,
    destinationTimezone: zones.length === 1 ? zones[0] : ""
  }));
}

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
        <label>Destination Country</label>
        <select onChange={handleCountryChange} required>
          <option value="">Select country</option>
          {allCountries.map(country => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {availableTimezones.length > 1 && (
        <div>
          <label>Timezone</label>
          <select
            name="destinationTimezone"
            value={formData.destinationTimezone}
            onChange={handleChange}
            required
          >
            <option value="">Select timezone</option>
            {availableTimezones.map(tz => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      )}

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