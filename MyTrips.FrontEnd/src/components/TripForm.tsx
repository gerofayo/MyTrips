import { useMemo, useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import {
  getAllCountries,
  getAllCurrencies,
} from "country-tz-currency";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
  initialData?: CreateTripRequest;
};

function TripForm({ onSubmit, initialData }: Props) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

  const [formData, setFormData] = useState<CreateTripRequest>({
    title: initialData?.title ?? "",
    destination: initialData?.destination ?? "",
    destinationTimezone: initialData?.destinationTimezone ?? "",
    startDate: initialData?.startDate ?? "",
    endDate: initialData?.endDate ?? "",
    budget: initialData?.budget ?? 0,
    currency: initialData?.currency ?? "",
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
    if (!raw) return [];
    return Object.keys(raw).sort();
  }, []);

  const currencyDisplay = useMemo(
    () => new Intl.DisplayNames(["en"], { type: "currency" }),
    []
  );

  useEffect(() => {
    if (initialData?.destination && countries.length > 0) {
      const countryEntry = countries.find((c) => c.name === initialData.destination);
      if (countryEntry) {
        setSelectedCountryCode(countryEntry.code);
        setAvailableTimezones(countryEntry.timezones);
      }
    }
  }, [initialData, countries]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
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
    onSubmit(formData);
  };

  const safeCurrencyName = (code: string) => {
    try {
      return currencyDisplay.of(code) || code;
    } catch {
      return code;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="section-title" style={{ marginTop: 0 }}>
        {initialData ? "Edit Trip Details" : "Plan a New Adventure"}
      </h2>

      <div>
        <label className="section-label">Travel Name</label>
        <input
          name="title"
          placeholder="e.g., Summer in Tokyo"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="inputgroup">
        <div style={{ flex: 1 }}>
          <label className="section-label">Destination Country</label>
          <select
            value={selectedCountryCode}
            onChange={handleCountryChange}
            required
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label className="section-label">Timezone</label>
          <select
            name="destinationTimezone"
            value={formData.destinationTimezone}
            onChange={handleChange}
            required
            disabled={availableTimezones.length === 0}
          >
            <option value="">{availableTimezones.length === 0 ? "Select country first" : "Select timezone"}</option>
            {availableTimezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inputgroup">
        <div style={{ flex: 1 }}>
          <label className="section-label">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ flex: 1 }}>
          <label className="section-label">End Date</label>
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="inputgroup">
        <div style={{ flex: 2 }}>
          <label className="section-label">Total Budget</label>
          <input
            name="budget"
            type="number"
            placeholder="0.00"
            value={formData.budget || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ flex: 1 }}>
          <label className="section-label">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" style={{ marginTop: '16px' }}>
        {initialData ? "Save Changes" : "Create Trip"}
      </button>
    </form>
  );
}

export default TripForm;