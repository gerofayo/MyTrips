import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { TripHero } from "../components/TripHero";
import {TripInfoCard} from "../components/TripInfoCard";
import {TripCalendar} from "../components/TripCalendar";
import {BudgetItemList} from "../components/BudgetItemList";
import {BudgetItemForm} from "../components/BudgetItemForm";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { deleteTrip } from "../services/tripService";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import "../styles/pages/TripDetailPage.css";

export default function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { items, createItem, updateItem, deleteItem, isSubmitting, loading: loadingItems } = useBudgetItems(tripId!);

  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const displayedItems = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter(item => item.date?.split('T')[0] === selectedDate);
  }, [items, selectedDate]);

  const handleDeleteTrip = async () => {
    if (!window.confirm("Are you sure you want to delete this entire trip? This action cannot be undone.")) return;
    
    try {
      await deleteTrip(tripId!);
      logger.info(`Trip deleted: ${tripId}`);
      navigate(PATHS.TRIPS_LIST, { replace: true });
    } catch (error) {
      logger.error("Error deleting trip", error);
    }
  };

  const handleEditClick = (item: BudgetItem) => {
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (formData: CreateBudgetItemRequest) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await createItem(formData);
      }
      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      logger.error("Error submitting budget item", error);
    }
  };

  if (tripLoading) return (
    <div className="loading-container">
      <p className="section-label">Loading trip details...</p>
    </div>
  );

  if (!trip) return <div className="app-container"><p>Trip not found.</p></div>;

  return (
    <div className="trip-detail">
      <div className="app-container trip-detail-wrapper">
        
        <div className="relative-container">
          <TripHero trip={trip} />
          <button
            className="btn-edit-floating"
            onClick={() => navigate(PATHS.EDIT_TRIP(tripId!))}
          >
            Edit Trip Details
          </button>
        </div>

        <TripInfoCard trip={trip} items={items} />

        <div className="divider-line" />

        <div className="itinerary-header">
          <h3 className="section-label">Itinerary</h3>
          <button
            className={showForm ? "button-outline danger" : "button button-sm"}
            onClick={showForm ? () => { setShowForm(false); setEditingItem(null); } : () => setShowForm(true)}
          >
            {showForm ? "Cancel" : "+ Add Expense"}
          </button>
        </div>

        <TripCalendar
          startDate={trip.startDate}
          endDate={trip.endDate}
          selectedDate={selectedDate}
          destinationTimezone={trip.destinationTimezone}
          onDateSelect={setSelectedDate}
        />

        <div className={`form-wrapper ${showForm ? "expanded" : "collapsed"}`}>
          <BudgetItemForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            selectedDate={selectedDate}
            initialData={editingItem}
          />
        </div>

        <BudgetItemList
          items={displayedItems}
          onDelete={(id) => window.confirm("Delete item?") && deleteItem(id)}
          onEdit={handleEditClick}
          isSubmitting={loadingItems}
          destinationTimezone={trip.destinationTimezone}
          selectedDate={selectedDate}
        />

        <section className="danger-zone">
          <h4 className="danger-zone-title">Danger Zone</h4>
          <p className="danger-zone-text">Once you delete a trip, there is no going back. Please be certain.</p>
          <button className="btn-delete-trip" onClick={handleDeleteTrip}>
            Delete Entire Trip
          </button>
        </section>

      </div>
    </div>
  );
}