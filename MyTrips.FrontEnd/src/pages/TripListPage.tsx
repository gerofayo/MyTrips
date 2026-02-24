import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
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
        <p className="section-label">{TEXTS.tripsList.loading}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="trips-page-header">
        <div>
          <h1 className="trips-page-title">{TEXTS.tripsList.title}</h1>
          <p className="trips-page-subtitle">
            {TEXTS.tripsList.subtitle}
          </p>
        </div>

        {trips.length > 0 && (
          <NavLink to={PATHS.CREATE_TRIP} className="button no-underline">
            {TEXTS.tripsList.createTripButton}
          </NavLink>
        )}
      </header>

      {trips.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-icon">🌎</div>
          <h2>{TEXTS.tripsList.emptyTitle}</h2>
          <p className="empty-state-text">
            {TEXTS.tripsList.emptyBody}
          </p>
          <NavLink to={PATHS.CREATE_TRIP} className="button no-underline">
            {TEXTS.tripsList.emptyCta}
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