import "../App.css";
import type { TripResponse } from "../types/TripResponse";

type Props = {
  trips: TripResponse[];
  onDelete: (id: string) => void;
};

function TripList({ trips, onDelete }: Props) {
  return (
    <ul className="trip-list">
      {trips.map((trip) => (
        <li key={trip.id} className="trip-item">
          {trip.name} - {trip.destination}
          <button
            className="delete-button"
            onClick={() => onDelete(trip.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TripList;
