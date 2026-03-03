import { useEffect, useMemo, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import BottomNavBar from "../components/BottomNavBar";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
import type { TripResponse } from "../types/Trip";
import { Icon } from "@iconify/react";
import { tripService } from "../services/tripService";
import "../styles/pages/TripListPage.css";

// Empty State Component
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-icon" role="img" aria-label="Empty state icon">
      <Icon icon="mdi:airplane-takeoff" className="empty-icon" />
    </div>
    <h2 className="empty-state-title">{TEXTS.tripsList.emptyTitle}</h2>
    <p className="empty-state-text">{TEXTS.tripsList.emptyBody}</p>
    <NavLink to={PATHS.CREATE_TRIP} className="button">
      {TEXTS.tripsList.emptyCta}
    </NavLink>
  </div>
);

// Trips Grid Component
const TripsGrid = ({ trips }: { trips: TripResponse[] }) => {
  const tripCards = useMemo(() => 
    trips.map(trip => (
      <TripCard key={trip.id} trip={trip} />
    )), [trips]
  );

  return (
    <div className="trips-grid">
      {tripCards}
    </div>
  );
};

// Hero Section Component
const TripsHero = () => (
  <div className="trips-hero">
    <div className="hero-content">
      <h1 className="page-title">{TEXTS.tripsList.title}</h1>
      <p className="page-subtitle">{TEXTS.tripsList.subtitle}</p>
    </div>
  </div>
);

// Loading Component
const LoadingState = () => (
  <div className="loading-container">
    <div className="loading-spinner" aria-hidden="true"></div>
    <p className="loading-text">{TEXTS.tripsList.loading}</p>
  </div>
);


export default function TripListPage() {
  const { trips, loading, error, reload } = useTrips();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logger.info("Cargando lista de viajes");
    reload();
  }, []);

  const handleImport = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      logger.info("Importing trips from file");
      await tripService.import(file);
      await reload();
      logger.info("Trips imported successfully");
    } catch (error) {
      logger.error("Failed to import trips", error);
      alert("Failed to import trips. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      logger.info("Exporting trips");
      const blob = await tripService.export();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trips-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      logger.info("Trips exported successfully");
    } catch (error) {
      logger.error("Failed to export trips", error);
      alert("Failed to export trips. Please try again.");
    }
  };

// Error state
  if (error) {
    return (
      <div className="trips-page">
        <TripsHero />
        <div className="trips-section">
          <div className="error-state">
            <h3>Error Loading Trips</h3>
            <p>{error}</p>
            <button onClick={reload} className="button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="trips-page">
        <TripsHero />
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      <div className="trips-page has-bottom-nav">
        <TripsHero />
        
        <div className="trips-section">
          {trips.length === 0 ? (
            <EmptyState />
          ) : (
            <TripsGrid trips={trips} />
          )}
        </div>
        
        <BottomNavBar onImport={handleImport} onExport={handleExport} />
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </>
  );
}
