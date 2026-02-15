import { useNavigate } from "react-router-dom";
import type { TripResponse } from "../types/Trip";

interface Props {
  trip: TripResponse;
}

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="trip-card"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div
        className="trip-card-image"
        // style={{ backgroundImage: `url(${trip.imageUrl})` }}
      />

      <div className="trip-card-content">
        <h3>{trip.name}</h3>
        <p className="trip-destination">{trip.destination}</p>
        <p className="trip-dates">
          {trip.startDate} → {trip.endDate}
        </p>
      </div>
    </div>
  );
}
