import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { useTrip } from "../hooks/useTrip";


export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { trip, loading: tripLoading } = useTrip(id);
  const { items, deleteItem, loading: itemsLoading, isSubmitting : isBudgetItemSubmitting } = useBudgetItems(id!);
  const { removeTrip } = useTrips();

  if (tripLoading) return <p>Cargando detalles del viaje...</p>;
  if (!trip) return <p>Viaje no encontrado</p>;

  const handleDelete = async () => {
    await removeTrip(trip.id);
    navigate("/trips");
  };

  if (tripLoading && !trip) return <p>Loading trip details...</p>;
  if (!trip) return <p>Trip not found</p>;


  return (
    <div className="trip-detail">
      <div className="trip-hero">
        <div className="trip-hero-overlay">
          <h1>{trip.title}</h1>
          <p className="trip-hero-destination">{trip.destination}</p>
        </div>
      </div>

      <div className="trip-detail-content">
        <div className="trip-info-card">
          <div className="trip-info-row">
            <span>Dates</span>
            <span>
              {trip.startDate} → {trip.endDate}
            </span>
          </div>

          <div className="trip-info-row">
            <span>Budget</span>
            <span>
              {trip.budget} {trip.currency}
            </span>
          </div>

          <div className="trip-info-row">
            <span>Created</span>
            <span>
              {new Date(trip.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h2>Budget</h2>

            {itemsLoading && <p>Loading budget items...</p>}

            <ul>
              {items.map(item => (
                <li key={item.id}>
                  {item.title} - {item.amount} {trip.currency}
                  <button onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled={isBudgetItemSubmitting}
            onClick={() => handleDelete()}
          >
            {isBudgetItemSubmitting ? "Borrando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
