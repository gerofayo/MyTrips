import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { TripHero } from "../components/TripHero";
import { TripInfoCard } from "../components/TripInfoCard";
import { TripCalendar } from "../components/TripCalendar";
import { BudgetItemList } from "../components/BudgetItemList";
import { BudgetItemForm } from "../components/BudgetItemForm";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { deleteTrip } from "../services/tripService";

export default function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>();
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { items, createItem, updateItem, deleteItem, isSubmitting, loading: loadingItems } = useBudgetItems(tripId!);
  const navigate = useNavigate();

  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const displayedItems = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter(item => item.date?.split('T')[0] === selectedDate);
  }, [items, selectedDate]);

  const handleDeleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteTrip(tripId!);
    }
    navigate("/trips")
  }

  const handleEditClick = (item: BudgetItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: CreateBudgetItemRequest) => {
    if (editingItem) {
      await updateItem(editingItem.id, formData);
    } else {
      await createItem(formData);
    }
    setEditingItem(null);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteItem(itemId);
    }
  };

  if (tripLoading) return (
    <div className="app-container" style={{ textAlign: 'center', padding: '100px' }}>
      <p className="section-label">Loading trip details...</p>
    </div>
  );

  if (!trip) return <p>Trip not found.</p>;

  return (
    <div className="trip-detail">
      <TripHero trip={trip} />

      <div className="app-container" style={{ position: 'relative', marginTop: '-60px' }}>

        <TripInfoCard trip={trip} items={items} />

        <div className="divider-line" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-label">Itinerary</h3>
          <button
            className={`delete-button ${showForm ? '' : 'primary'}`}
            onClick={showForm ? handleCancelForm : () => setShowForm(true)}
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              background: showForm ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: showForm ? 'var(--danger)' : 'white'
            }}
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
          onDelete={handleDeleteItem}
          onEdit={handleEditClick}
          isSubmitting={loadingItems}
          destinationTimezone={trip.destinationTimezone}
          selectedDate={selectedDate}
        />
      </div>
      <div className="divider-line" />
      <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <button
          className="delete-button"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this entire trip? This action cannot be undone.")) {
              handleDeleteTrip();
            }
          }}
          style={{ padding: '10px 40px' }}
        >
          Delete Trip
        </button>
      </div>
    </div>
  );
}