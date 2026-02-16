import { useEffect, useState } from "react";
import {
  getTrips,
  postTrip,
  deleteTrip,
  getTripById
} from "../services/tripService";
import type { CreateTripRequest, TripResponse } from "../types/Trip";

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
      setError(null);
      const data = await getTrips();
      setTrips(data);
    } catch (e) {
      setError("Error loading trips");
    } finally {
      setLoading(false);
    }
  }

  async function createTrip(trip: CreateTripRequest): Promise<TripResponse> {
    const newTrip = await postTrip(trip);
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  }

  async function removeTrip(id: string) {
    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError("Failed to delete trip");
      throw e;
    }
  }

  async function fetchTripById(id: string): Promise<TripResponse> {
    var response: TripResponse = await getTripById(id);
    return response;
  }

  return {
    trips,
    loading,
    error,
    createTrip,
    removeTrip,
    fetchTripById,
    reload: loadTrips,
  };
}