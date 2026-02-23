import { useState, useEffect } from "react";
import { tripService } from "../services/tripService";
import type { TripResponse } from "../types/Trip";

export function useTrip(id: string | undefined) {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await tripService.getById(id);
        setTrip(data);
      } catch (err) {
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [id]);

  const editTrip = async (data: Partial<TripResponse>) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      const updatedTrip = await tripService.update(id, data);
      setTrip(updatedTrip)
      return updatedTrip;
    } catch (err) {
      setError("Failed to update trip.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeTrip = async () => {
    if (!id) return;
    try {
      await tripService.delete(id);
      setTrip(null);
    } catch (err) {
      setError("Failed to delete trip.");
      throw err;
    }
  };

  return { 
    trip, 
    loading, 
    error, 
    editTrip, 
    removeTrip, 
    isUpdating 
  };
}