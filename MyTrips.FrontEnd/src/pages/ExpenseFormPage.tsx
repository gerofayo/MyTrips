import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { BudgetItemForm } from "../components/BudgetItemForm";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { PATHS } from "../routes/paths";
import { TEXTS } from "../config/texts";
import { logger } from "../utils/logger";
import "../styles/pages/TripFormPage.css";

export default function ExpenseFormPage() {
  const { tripId, itemId } = useParams<{ tripId: string; itemId?: string }>();
  const navigate = useNavigate();
  
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { items, createItem, updateItem, isSubmitting } = useBudgetItems(tripId!);

  const [initialData, setInitialData] = useState<BudgetItem | null>(null);
  const isEditing = !!itemId;

  useEffect(() => {
    if (isEditing && items.length > 0) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        setInitialData(item);
      }
    }
  }, [isEditing, itemId, items]);

  const handleSubmit = async (formData: CreateBudgetItemRequest) => {
    try {
      if (isEditing && itemId) {
        await updateItem(itemId, formData);
        logger.info(`Budget item updated: ${itemId}`);
      } else {
        await createItem(formData);
        logger.info(`Budget item created for trip: ${tripId}`);
      }
      navigate(PATHS.TRIP_DETAILS(tripId!));
    } catch (error) {
      logger.error("Error submitting budget item", error);
      alert("Error saving expense. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(PATHS.TRIP_DETAILS(tripId!));
  };

  if (tripLoading) {
    return (
      <div className="loading-container">
        <p className="section-label">{TEXTS.tripDetail.loading}</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="app-container not-found-container">
        <div className="not-found-content">
          <p className="not-found-text">{TEXTS.tripDetail.notFound}</p>
          <button 
            className="button" 
            onClick={() => navigate(PATHS.TRIPS_LIST)}
          >
            ← Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-form-page">
      <div className="app-container">
        <div className="trip-form-header">
          <button className="back-button" onClick={handleCancel}>
            ← Cancel
          </button>
          <h1 className="trip-form-title">
            {isEditing ? TEXTS.budgetItemForm.submitUpdate : "Add Expense"}
          </h1>
          <div style={{ width: 60 }} /> {/* Spacer for alignment */}
        </div>

        <div className="trip-form-content">
          <BudgetItemForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            selectedDate={null}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}

