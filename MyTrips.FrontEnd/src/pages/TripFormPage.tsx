import TripForm from "../components/TripForm";
import { useTrips } from "../hooks/useTrips";
import { useNavigate } from "react-router-dom";
import type { CreateTripRequest } from "../types/Trip";

export default function TripFormPage() {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateTripRequest) => {
    try {
      await createTrip(data);
      navigate("/trips");
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  return (
    <div className="app-container" style={{ marginTop: '60px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <button 
          onClick={() => navigate("/trips")} 
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
          ← Back to Your Trips
        </button>
      </div>

      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontFamily: 'Poppins', 
          fontWeight: 700 
        }}>
          New Adventure
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Fill in the details below to start planning your next getaway.
        </p>
      </header>
      <TripForm onSubmit={handleCreate} />
      
    </div>
  );
}