import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
import { tripService } from "../services/tripService";
import "../styles/pages/TripListPage.css";

export default function TripListPage() {
  const { trips, loading, reload } = useTrips();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    logger.info("Cargando lista de viajes");
    reload();
  }, []);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await tripService.import(file);
      alert("Trips imported successfully!");
      reload();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please check the file format.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async () => {
    try {
      const blob = await tripService.export();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mytrips_export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="section-label">{TEXTS.tripsList.loading}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="trips-page-header">
        <h1 className="trips-page-title">{TEXTS.tripsList.title}</h1>
        <p className="trips-page-subtitle">
          {TEXTS.tripsList.subtitle}
        </p>
      </div>

      <div className="trips-grid">
        {/* Create Trip Card - Always first */}
        <NavLink to={PATHS.CREATE_TRIP} className="create-trip-card">
          <div className="create-trip-icon">+</div>
          <h3 className="create-trip-text">Create New Trip</h3>
          <p className="create-trip-subtext">Plan your next adventure</p>
        </NavLink>

        {/* Existing Trips */}
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>

      {/* Import/Export Controls - Fixed position */}
      <div className="import-export-controls">
        <button 
          className="action-button"
          onClick={handleExport}
          disabled={isImporting}
        >
          Export
        </button>
        <label className="action-button">
          Import
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="file-input"
          />
        </label>
      </div>
    </div>
  );
}
