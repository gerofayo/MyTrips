import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { TripHero } from "../components/TripHero";
import { TripInfoCard } from "../components/TripInfoCard";
import { TripCalendar } from "../components/TripCalendar";
import { BudgetItemList } from "../components/BudgetItemList";
import { BudgetItemForm } from "../components/BudgetItemForm";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading: tripLoading } = useTrip(id);
  const { items, createItem, deleteItem, isSubmitting } = useBudgetItems(id!);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateItem = async (item: any) => {
    await createItem(item);
    setShowForm(false);
  }


  if (tripLoading || !trip) return <p>Loading...</p>;

  const displayedItems = selectedDate
    ? items.filter(item => item.date === selectedDate)
    : items;

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
          onDateSelect={setSelectedDate}
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
          onDelete={deleteItem}
          isSubmitting={isSubmitting}
        />


      </div>
    </div>

  );
}