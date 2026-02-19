import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { TripHero } from "../components/TripHero";
import { TripInfoCard } from "../components/TripInfoCard";
import { TripCalendar } from "../components/TripCalendar";
import { BudgetItemList } from "../components/BudgetItemList";
import { BudgetItemForm } from "../components/BudgetItemForm";
import type { CreateBudgetItemRequest } from "../types/BudgetItem";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading: tripLoading } = useTrip(id);
  const { items, createItem, deleteItem, isSubmitting, loading: loadingItems } = useBudgetItems(id!);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const displayedItems = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter(item => item.date?.split('T')[0] === selectedDate);
  }, [items, selectedDate]);

  const handleCreateItem = async (item: Omit<CreateBudgetItemRequest, "id">) => {
    await createItem(item);
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
            onClick={() => setShowForm(prev => !prev)}
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
            onSubmit={handleCreateItem}
            isSubmitting={isSubmitting}
            selectedDate={selectedDate}
          />
        </div>

        <BudgetItemList
          items={displayedItems}
          onDelete={handleDeleteItem}
          isSubmitting={loadingItems}
          destinationTimezone={trip.destinationTimezone}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}