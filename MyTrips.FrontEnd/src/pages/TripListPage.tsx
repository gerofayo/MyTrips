import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import "../styles/pages/TripListPage.css";

export default function TripListPage() {
  const { trips, loading, reload } = useTrips();

  useEffect(() => {
    logger.info("Cargando lista de viajes");
    reload();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p className="section-label">Searching for your adventures...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="trips-page-header">
        <div>
          <h1 className="trips-page-title">My Journeys</h1>
          <p className="trips-page-subtitle">
            Manage and track your travel budgets
          </p>
        </div>

        {trips.length > 0 && (
          <NavLink to={PATHS.CREATE_TRIP} className="button no-underline">
            + Create New Trip
          </NavLink>
        )}
      </header>

      {trips.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-icon">🌎</div>
          <h2>No trips found</h2>
          <p className="empty-state-text">
            You haven't planned any trips yet. Start organizing your next getaway and keep your expenses under control.
          </p>
          <NavLink to={PATHS.CREATE_TRIP} className="button no-underline">
            Start Planning Now
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