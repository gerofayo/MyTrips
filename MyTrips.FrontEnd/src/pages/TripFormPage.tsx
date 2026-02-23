import TripForm from "../components/TripForm";
import { useTrips } from "../hooks/useTrips";
import { useTrip } from "../hooks/useTrip"; // Necesitas el hook de un solo viaje
import { useNavigate, useParams } from "react-router-dom";
import type { CreateTripRequest } from "../types/Trip";

export default function TripFormPage() {
  const { id } = useParams<{ id: string }>(); // Extraemos el ID de la URL
  const isEditMode = Boolean(id);
  
  const { createTrip , } = useTrips();
  const { trip, loading, editTrip } = useTrip(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateTripRequest) => {
    try {
      if (isEditMode && id) {
        await editTrip(data); 
      } else {
        await createTrip(data); 
      }
      navigate("/trips");
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} trip:`, error);
    }
  };

  if (isEditMode && loading) {
    return <div className="app-container">Loading trip data...</div>;
  }

  return (
    <div className="app-container" style={{ marginTop: '60px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(isEditMode ? `/trips/${id}` : "/trips")} 
          className="nav-link" 
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: 0, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}
        >
          ← {isEditMode ? "Back to Trip Details" : "Back to Your Trips"}
        </button>
      </div>

      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontFamily: 'Poppins', 
          fontWeight: 700 
        }}>
          {isEditMode ? "Edit Adventure" : "New Adventure"}
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          {isEditMode 
            ? "Update the details of your journey." 
            : "Fill in the details below to start planning your next getaway."}
        </p>
      </header>

      <TripForm 
        onSubmit={handleSubmit} 
        initialData={isEditMode ? trip : undefined} 
      />
      
    </div>
  );
}