import { useNavigate } from "react-router-dom";
import type { TripResponse } from "../types/Trip";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger"; // Nuestro nuevo logger
import "../styles/components/TripCard.css";

interface Props {
  trip: TripResponse;
}

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  const formatDate = (dateString: string, timezone: string) => {
    try {
      const date = new Date(`${dateString}T00:00:00`);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
      }).format(date);
    } catch (error) {
      logger.error(`Error formatting date for trip ${trip.id}`, error);
      return "N/A";
    }
  };

  const handleCardClick = () => {
    logger.info(`Navigating to trip: ${trip.id}`);
    navigate(PATHS.TRIP_DETAILS(trip.id));
  };

  //TODO: Sacar este placeholder
  const cardImage = `https://loremflickr.com/400/300/${encodeURIComponent(trip.destination)},travel/all`;

  return (
    <div className="trip-card" onClick={handleCardClick}>
      <div
        className="trip-card-image"
        style={{ backgroundImage: `url(${cardImage})` }}
      />

      <div className="trip-card-budget badge-price">
        <span className="amount-text">
          ${trip.budget.toLocaleString()}
        </span>
        <span className="currency-code">
          {trip.currency}
        </span>
      </div>

      <div className="trip-card-content">
        <div>
          <span className="section-label trip-destination-label">
            {trip.destination}
          </span>
          <h3 className="trip-card-title">{trip.title}</h3>
        </div>

        <div className="item-meta trip-card-footer">
          <span className="trip-card-date-text">
            🗓️ {formatDate(trip.startDate, trip.destinationTimezone)} — {formatDate(trip.endDate, trip.destinationTimezone)}
          </span>
        </div>
      </div>
    </div>
  );
}