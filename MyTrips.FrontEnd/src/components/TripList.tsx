import type { Trip } from "../types/Trip";

interface Props {
  trips: Trip[];
}

function TripList({ trips }: Props) {
  return (
    <ul>
      {trips.map((trip) => (
        <li key={trip.id}>
          {trip.name} - {trip.destination}
        </li>
      ))}
    </ul>
  );
}

export default TripList;
