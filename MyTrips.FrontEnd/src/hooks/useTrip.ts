import { useState, useEffect } from "react";
import { getTripById } from "../services/tripService";
import type { TripResponse } from "../types/Trip";

export function useTrip(id: string | undefined) {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrip() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTripById(id);
        setTrip(data);
      } catch (err) {
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [id]);

  return { trip, loading, error };
}