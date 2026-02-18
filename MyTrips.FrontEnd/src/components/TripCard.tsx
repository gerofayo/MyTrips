import { useNavigate } from "react-router-dom";
import type { TripResponse } from "../types/Trip";

interface Props {
  trip: TripResponse;
}

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
  };

  const cardImage = `https://loremflickr.com/400/300/${encodeURIComponent(trip.destination)},landscape/all`;

  return (
    <div
      className="trip-card"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div
        className="trip-card-image"
        style={{ backgroundImage: `url(${cardImage})` }}
      />

      <div className="trip-card-content">
        <div >
          <h3>{trip.title}</h3>
          <span className="trip-budget-badge">
            {trip.budget.toLocaleString()} {trip.currency}
          </span>
        </div>
        
        <p className="trip-destination">{trip.destination}</p>
        
        <p className="trip-dates">
          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </p>
      </div>
    </div>
  );
}