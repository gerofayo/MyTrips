import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";

export default function TripListPage() {
  const { trips } = useTrips();

  return (
    <>
      <h1>Trips</h1>
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </>
  );
}
