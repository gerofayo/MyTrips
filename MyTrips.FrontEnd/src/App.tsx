import { useEffect, useState } from "react";
import TripList from "./components/TripList";
import type { Trip } from "./types/Trip";
import { getTrips } from "./services/tripServices";

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  return (
    <div>
      <h1>Trip Planner</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TripList trips={trips} />
      )}
    </div>
  );
}

export default App
