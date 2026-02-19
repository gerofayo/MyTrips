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
    <form onSubmit={handleSubmit} className="trip-form">
      <div>
        <label>Travel Name</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Destination Country</label>
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

      {availableTimezones.length > 0 && (
        <div>
          <label>Timezone</label>
          <select
            name="destinationTimezone"
            value={formData.destinationTimezone}
            onChange={handleChange}
            required
          >
            <option value="">Select timezone</option>
            {availableTimezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Start Date</label>
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Budget</label>
        <input
          name="budget"
          type="number"
          value={formData.budget || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Currency</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
        >
          <option value="">Select currency</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr} — {safeCurrencyName(curr)}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">
        {initialData ? "Update Trip" : "Add Trip"}
      </button>
    </form>
  );
}

export default TripForm;