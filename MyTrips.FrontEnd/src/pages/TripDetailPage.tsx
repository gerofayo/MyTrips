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
  const { items, createItem, deleteItem, isSubmitting } = useBudgetItems(id!);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const displayedItems = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter(item => item.date === selectedDate);
  }, [items, selectedDate]);

  const handleCreateItem = async (item: CreateBudgetItemRequest) => {
    await createItem(item);
    setShowForm(false);
  }

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  }

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  }


  if (tripLoading || !trip) return <p>Loading...</p>;

  return (

    <div className="trip-detail">
      <TripHero trip={trip} />

      <div className="trip-detail-content">
        <TripInfoCard trip={trip} items={items} />

        <h3 className="section-label">Itirenary</h3>
        <TripCalendar
          startDate={trip.startDate}
          endDate={trip.endDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        <button className="add-item-btn" onClick={() => setShowForm(prev => !prev)}>
          {showForm ? "Close Form" : "Add Budget Item"}
        </button>
        {showForm &&
          <div className={`form-wrapper ${showForm ? "expanded" : "collapsed"}`}>
            <BudgetItemForm
              onSubmit={handleCreateItem}
              isSubmitting={isSubmitting}
              selectedDate={selectedDate}
            />
          </div>
        }

        <BudgetItemList
          items={displayedItems}
          onDelete={handleDeleteItem}
          isSubmitting={isSubmitting}
        />


      </div>
    </div>

  );
}