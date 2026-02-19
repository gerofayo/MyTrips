import { useNavigate } from "react-router-dom";
import type { TripResponse } from "../types/Trip";

interface Props {
  trip: TripResponse;
}

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  const formatDate = (dateString: string, timezone: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat('us-US', { 
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    }).format(date);
  };

  
  const cardImage = `https://loremflickr.com/400/300/${encodeURIComponent(trip.destination)},travel/all`;

  return (
    <div
      className="trip-card"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div
        className="trip-card-image"
        style={{ backgroundImage: `url(${cardImage})` }}
      />

      
      <div className="trip-budget-badge">
        ${trip.budget.toLocaleString()} {trip.currency}
      </div>

      
      <div className="trip-card-content">
        <div>
          <p className="trip-destination">{trip.destination}</p>
          <h3>{trip.title}</h3>
        </div>

        <div className="trip-dates">
          <span>🗓️ {formatDate(trip.startDate, trip.destinationTimezone)} — {formatDate(trip.endDate, trip.destinationTimezone)}</span>
        </div>
      </div>
    </div>
  );
}