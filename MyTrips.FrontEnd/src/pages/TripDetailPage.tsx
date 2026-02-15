import { useParams } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import type { TripResponse } from "../types/Trip";

export default function TripDetailPage() {
  const { id } = useParams();
  const { trips , removeTrip} = useTrips();

  const trip = trips.find((t: TripResponse) => t.id === id);

  if (!trip) return <p>Trip not found</p>;

  return (
    <div className="trip-detail">
      <div className="trip-hero">
        <div className="trip-hero-overlay">
          <h1>{trip.name}</h1>
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
          <button
            className="delete-button"
            onClick={() => removeTrip(trip.id)}
          >
            Delete Trip
          </button>
        </div>
      </div>
    </div>
  );
}
