import { useMemo, useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import { getAllCountries, getAllCurrencies } from "country-tz-currency";
import { logger } from "../utils/logger";
import "../styles/forms.css";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
  initialData?: CreateTripRequest | null;
};

function TripForm({ onSubmit, initialData }: Props) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTripRequest>({
    title: "",
    destination: "",
    destinationTimezone: "",
    startDate: "",
    endDate: "",
    budget: 0,
    currency: "",
  });

  const countries = useMemo(() => {
    const raw = getAllCountries();
    if (!raw) return [];
    return Object.entries(raw).map(([code, country]) => ({
      code,
      name: country.countryName,
      currencyCode: country.currencyCode,
      timezones: country.timeZone || [],
    }));
  }, []);

  const currencies = useMemo(() => {
    const raw = getAllCurrencies();
    return raw ? Object.keys(raw).sort() : [];
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedStart = initialData.startDate?.split("T")[0] || "";
      const formattedEnd = initialData.endDate?.split("T")[0] || "";

      setFormData({
        ...initialData,
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      const countryEntry = countries.find((c) => c.name === initialData.destination);
      if (countryEntry) {
        setSelectedCountryCode(countryEntry.code);
        setAvailableTimezones(countryEntry.timezones);
      }
    }
  }, [initialData, countries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (dateError) setDateError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountryCode(code);
    const country = countries.find((c) => c.code === code);
    
    if (!country) {
      setAvailableTimezones([]);
      return;
    }

    const zones = country.timezones;
    setAvailableTimezones(zones);
    setFormData((prev) => ({
      ...prev,
      destination: country.name,
      destinationTimezone: zones.length === 1 ? zones[0] : "",
      currency: country.currencyCode || prev.currency,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setDateError("End date cannot be before start date");
      logger.warn("Validation failed: End date before start date");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form-container">
      <h2 className="form-title">
        {initialData ? "Edit Trip Details" : "Plan a New Adventure"}
      </h2>

      <div className="form-group">
        <label className="section-label">Travel Name</label>
        <input
          className="form-input"
          name="title"
          placeholder="e.g., Summer in Tokyo"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="section-label">Destination Country</label>
          <select className="form-select" value={selectedCountryCode} onChange={handleCountryChange} required>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="section-label">Timezone</label>
          <select
            className="form-select"
            name="destinationTimezone"
            value={formData.destinationTimezone}
            onChange={handleChange}
            required
            disabled={availableTimezones.length === 0}
          >
            <option value="">
              {availableTimezones.length === 0 ? "Select country first" : "Select timezone"}
            </option>
            {availableTimezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="section-label">Start Date</label>
          <input
            className={`form-input ${dateError ? 'input-error' : ''}`}
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="section-label">End Date</label>
          <input
            className={`form-input ${dateError ? 'input-error' : ''}`}
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      {dateError && <p className="form-error" style={{ color: 'var(--danger)', marginTop: '-10px', marginBottom: '10px', fontSize: '0.8rem' }}>{dateError}</p>}

      <div className="form-grid form-grid-budget">
        <div className="form-group">
          <label className="section-label">Total Budget</label>
          <input
            className="form-input"
            name="budget"
            type="number"
            placeholder="0.00"
            value={formData.budget || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="section-label">Currency</label>
          <select className="form-select" name="currency" value={formData.currency} onChange={handleChange} required>
            <option value="">Select...</option>
            {currencies.map((curr) => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="button form-submit-btn">
        {initialData ? "Save Changes" : "Create Trip"}
      </button>
    </form>
  );
}

export default TripForm;