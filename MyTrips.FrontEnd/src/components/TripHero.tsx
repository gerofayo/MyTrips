import type { TripResponse } from "../types/Trip";
import "../styles/components/TripHero.css";

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
        <p className="trip-hero-destination">
          {trip.destination}
        </p>
        
        <h1 className="trip-hero-title">
          {trip.title}
        </h1>

        <div className="trip-hero-meta">
          <span className="hero-budget-badge">
            Budget: ${trip.budget.toLocaleString()} {trip.currency}
          </span>
        </div>
      </div>
    </div>
  );
};