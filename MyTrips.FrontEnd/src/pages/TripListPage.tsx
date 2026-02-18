import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import { NavLink } from "react-router-dom";

export default function TripListPage() {
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Searching for your trips...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header >
        <h1>Your Trips</h1>
        {trips.length > 0 && (
          <NavLink to="/create" className="button" >
            + New
          </NavLink>
        )}
      </header>

      {trips.length === 0 ? (
        <div className="empty-state">
          <p >
            You don't have any trips yet. Start planning your next adventure and create your first trip!
          </p>
          <NavLink to="/create" >
            Start Planning
          </NavLink>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}