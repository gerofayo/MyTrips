import type { TripResponse } from "../types/Trip";

interface Props {
  trip: TripResponse;
}

export const TripHero = ({ trip }: Props) => {
  const heroImage = `https://loremflickr.com/1200/800/${encodeURIComponent(trip.destination)},travel/all`;

  return (
    <div 
      className="trip-hero" 
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="trip-hero-overlay">
        <p className="trip-destination" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
          {trip.destination}
        </p>
        
        <h1 style={{ 
          margin: 0, 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          lineHeight: 1.1 
        }}>
          {trip.title}
        </h1>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <span className="trip-budget-badge" style={{ position: 'static', background: 'var(--primary)', color: 'white' }}>
            Budget: ${trip.budget.toLocaleString()} {trip.currency}
          </span>
        </div>
      </div>
    </div>
  );
};