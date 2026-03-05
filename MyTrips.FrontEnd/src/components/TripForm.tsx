import { useMemo, useState, useEffect } from "react";
import type { CreateTripRequest } from "../types/Trip";
import { getAllCountries, getAllCurrencies } from "country-tz-currency";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
import { SearchableSelect, type SearchableSelectOption } from "./SearchableSelect";
import { useNumericInput } from "../hooks/useNumericInput";
import "../styles/forms.css";

type Props = {
  onSubmit: (trip: CreateTripRequest) => void;
  initialData?: CreateTripRequest | null;
};

function TripForm({ onSubmit, initialData }: Props) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [budgetInput, setBudget, getBudget] = useNumericInput(0);

  const [formData, setFormData] = useState<CreateTripRequest>({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: 0,
    currency: "USD",
    imageUrl: "",
  });

  const countries = useMemo(() => {
    const raw = getAllCountries();
    if (!raw) return [];
    return Object.entries(raw).map(([code, country]) => ({
      code,
      name: country.countryName,
      currencyCode: country.currencyCode,
    }));
  }, []);

  const currencies = useMemo(() => {
    const raw = getAllCurrencies();
    if (!raw) return [];
    return Object.values(raw).sort((a, b) => a.code.localeCompare(b.code));
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

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = countries.find((c) => c.code === code);
    
    if (!country) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      destination: country.name,
      currency: country.currencyCode || prev.currency,
    }));
  };

  const handleCurrencyChange = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      currency: code,
    }));
  };

  // Prepare options for SearchableSelect
  const countryOptions: SearchableSelectOption[] = countries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const currencyOptions: SearchableSelectOption[] = currencies.map((curr) => ({
    value: curr.code,
    label: `${curr.code} - ${curr.name}`,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setDateError(TEXTS.tripForm.dateError);
      logger.warn("Validation failed: End date before start date");
      return;
    }

    onSubmit({
      ...formData,
      budget: getBudget(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form-container">
      <div className="form-header">
        <h2 className="form-title">
          {initialData ? TEXTS.tripForm.mainTitleEdit : TEXTS.tripForm.mainTitleCreate}
        </h2>
      </div>

      <div className="form-group">
        <label className="section-label">{TEXTS.tripForm.travelNameLabel}</label>
        <input
          className="form-input"
          name="title"
          placeholder={TEXTS.tripForm.travelNamePlaceholder}
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="section-label">{TEXTS.tripForm.destinationCountryLabel}</label>
          <SearchableSelect
            options={countryOptions}
            value={selectedCountryCode}
            onChange={handleCountryChange}
            placeholder={TEXTS.tripForm.selectCountryPlaceholder}
            required
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="section-label">{TEXTS.tripForm.startDateLabel}</label>
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
          <label className="section-label">{TEXTS.tripForm.endDateLabel}</label>
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
      
      {dateError && <p className="form-error">{dateError}</p>}

      <div className="form-grid form-grid-budget">
        <div className="form-group">
          <label className="section-label">{TEXTS.tripForm.totalBudgetLabel}</label>
          <input
            className="form-input"
            name="budget"
            type="number"
            placeholder={TEXTS.tripForm.totalBudgetPlaceholder}
            value={budgetInput}
            onChange={setBudget}
            required
          />
        </div>

        <div className="form-group">
          <label className="section-label">{TEXTS.tripForm.currencyLabel}</label>
          <SearchableSelect
            options={currencyOptions}
            value={formData.currency}
            onChange={handleCurrencyChange}
            placeholder={TEXTS.tripForm.currencyPlaceholder}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="section-label">{TEXTS.tripForm.imageUrlLabel}</label>
        <input
          className="form-input"
          name="imageUrl"
          type="url"
          placeholder={TEXTS.tripForm.imageUrlPlaceholder}
          value={formData.imageUrl || ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="button form-submit-btn">
        {initialData ? TEXTS.tripForm.submitEdit : TEXTS.tripForm.submitCreate}
      </button>
    </form>
  );
}

export default TripForm;

