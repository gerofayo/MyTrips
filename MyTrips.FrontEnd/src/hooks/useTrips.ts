import { useEffect, useState } from "react";
import { getTrips, postTrip, deleteTrip } from "../services/tripService";
import type { TripResponse } from "../types/TripResponse";

export function useTrips() {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      setLoading(true);
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError("Error loading trips");
    } finally {
      setLoading(false);
    }
  }

  async function createTrip(trip: Omit<TripResponse, "id">) {
    const newTrip = await postTrip(trip);
    setTrips((prev) => [...prev, newTrip]);
  }

  async function removeTrip(id: string) {
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    trips,
    loading,
    error,
    createTrip,
    removeTrip,
    reload: loadTrips,
  };
}
