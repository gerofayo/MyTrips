import { useNavigate, useParams } from "react-router-dom";
import TripForm from "../components/TripForm";
import { useTrips } from "../hooks/useTrips";
import { useTrip } from "../hooks/useTrip";
import type { CreateTripRequest } from "../types/Trip";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
import "../styles/pages/TripFormPage.css";

export default function TripFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const { createTrip } = useTrips();
  const { trip, loading, editTrip } = useTrip(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateTripRequest) => {
    try {
      if (isEditMode && id) {
        await editTrip(data);
        logger.info(`Trip updated successfully: ${id}`);
      } else {
        await createTrip(data);
        logger.info("New trip created successfully");
      }
      navigate(PATHS.TRIPS_LIST);
    } catch (error) {
      logger.error(`Failed to ${isEditMode ? 'update' : 'create'} trip`, error);
    }
  };

  const handleBack = () => {
    const destination = isEditMode && id ? PATHS.TRIP_DETAILS(id) : PATHS.TRIPS_LIST;
    navigate(destination);
  };

  if (isEditMode && loading) {
    return (
      <div className="app-container form-loading">
        <p>{TEXTS.tripFormPage.loading}</p>
      </div>
    );
  }

  return (
    <div className="app-container trip-form-page">
      
      <button onClick={handleBack} className="back-button">
        ← {isEditMode ? TEXTS.tripFormPage.backToDetails : TEXTS.tripFormPage.backToTrips}
      </button>

      <header className="form-header">
        <h1>{isEditMode ? TEXTS.tripFormPage.editTitle : TEXTS.tripFormPage.newTitle}</h1>
        <p>
          {isEditMode 
            ? TEXTS.tripFormPage.editSubtitle 
            : TEXTS.tripFormPage.newSubtitle}
        </p>
      </header>

      <TripForm 
        onSubmit={handleSubmit} 
        initialData={isEditMode ? trip : undefined} 
      />
      
    </div>
  );
}