import type { TripResponse } from "../types/Trip";

interface Props {
  trip: TripResponse;
}

export const TripHero = ({ trip }: Props) => {
  const heroImage = `https://loremflickr.com/1200/600/${encodeURIComponent(trip.destination)},travel/all`;

  return (
    <div 
      className="trip-hero" 
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="trip-hero-overlay">
        <p className="trip-destination">{trip.destination.toUpperCase()}</p>
        <h1>{trip.title}</h1>
      </div>
    </div>
  );
};