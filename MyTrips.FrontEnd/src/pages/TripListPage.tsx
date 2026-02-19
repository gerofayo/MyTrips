import { useTrips } from "../hooks/useTrips";
import TripCard from "../components/TripCard";
import { NavLink } from "react-router-dom";

export default function TripListPage() {
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '100px' }}>
        <p className="section-label">Searching for your adventures...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>My Journeys</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage and track your travel budgets
          </p>
        </div>

        {trips.length > 0 && (
          <NavLink to="/create" className="button" style={{ textDecoration: 'none' }}>
            + Create New Trip
          </NavLink>
        )}
      </header>

      {trips.length === 0 ? (
        <div className="mini-form-card" style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '20px' 
        }}>
          <div style={{ fontSize: '3rem' }}>🌎</div>
          <h2 style={{ margin: 0 }}>No trips found</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            You haven't planned any trips yet. Start organizing your next getaway and keep your expenses under control.
          </p>
          <NavLink to="/create" className="button" style={{ textDecoration: 'none', marginTop: '10px' }}>
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