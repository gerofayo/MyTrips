import { apiClient, getSessionId } from "../api/apiClient";
import type { TripResponse, CreateTripRequest } from "../types/Trip";
import { 
  getTripsFromCache, 
  setTripsToCache, 
  getTripsFromCacheWithoutExpiration,
  createTripsJsonFile
} from "./tripCache";

// Get cached trips - returns instantly from localStorage
export async function getTrips(): Promise<TripResponse[]> {
  // First, try to get from cache for instant loading
  const cachedTrips = getTripsFromCache();
  
  try {
    // Then fetch from API to get latest data
    const apiTrips = await apiClient.get<TripResponse[]>("/trips");
    
    // If API returns trips, update cache and return
    if (apiTrips && apiTrips.length > 0) {
      setTripsToCache(apiTrips);
      return apiTrips;
    }
    
    // API returned empty - check if we have cached data and session might have expired
    if (cachedTrips && cachedTrips.length > 0) {
      // Try to import cache to restore session
      await importFromCache(cachedTrips);
      return cachedTrips;
    }
    
    // No cached data, return empty
    return [];
  } catch (error) {
    // API error - return cached data if available
    if (cachedTrips && cachedTrips.length > 0) {
      console.log("API error, returning cached trips");
      return cachedTrips;
    }
    throw error;
  }
}

// Get trips without cache (for force refresh)
export async function getTripsFromApi(): Promise<TripResponse[]> {
  return apiClient.get<TripResponse[]>("/trips");
}

// Import trips from cache when session expires
async function importFromCache(cachedTrips: TripResponse[]): Promise<void> {
  try {
    const file = createTripsJsonFile(cachedTrips);
    await importTrips(file);
  } catch (error) {
    console.error("Failed to import cached trips:", error);
  }
}

export async function getTripById(id: string): Promise<TripResponse> {
  return apiClient.get<TripResponse>(`/trips/${id}`);
}

export async function postTrip(
  createTripRequest: CreateTripRequest
): Promise<TripResponse> {
  const newTrip = await apiClient.post<TripResponse>("/trips", createTripRequest);
  
  // Update cache with new trip
  const cachedTrips = getTripsFromCacheWithoutExpiration();
  if (cachedTrips) {
    setTripsToCache([...cachedTrips, newTrip]);
  }
  
  return newTrip;
}

export async function updateTrip(
  id: string, 
  data: Partial<CreateTripRequest>
): Promise<TripResponse> {
  const updatedTrip = await apiClient.put<TripResponse>(`/trips/${id}`, data);
  
  // Update cache with updated trip
  const cachedTrips = getTripsFromCacheWithoutExpiration();
  if (cachedTrips) {
    const updatedCache = cachedTrips.map(t => t.id === id ? updatedTrip : t);
    setTripsToCache(updatedCache);
  }
  
  return updatedTrip;
}

export async function deleteTrip(id: string): Promise<void> {
  try {
    await apiClient.delete(`/trips/${id}`);
    
    // Update cache by removing deleted trip
    const cachedTrips = getTripsFromCacheWithoutExpiration();
    if (cachedTrips) {
      const updatedCache = cachedTrips.filter(t => t.id !== id);
      setTripsToCache(updatedCache);
    }
  } catch (error) {
    console.error("Delete trip failed:", error);
    throw error;
  }
}

export async function importTrips(file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  return fetch(`${import.meta.env.VITE_API_URL}/trips/import`, {
    method: 'POST',
    headers: {
      'X-Session-Id': getSessionId()
    },
    body: formData
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const result = await res.json();
    
    // After import, refresh cache from API
    try {
      const apiTrips = await apiClient.get<TripResponse[]>("/trips");
      if (apiTrips) {
        setTripsToCache(apiTrips);
      }
    } catch {
      // Ignore cache refresh errors
    }
    
    return result;
  });
}

export async function exportTrips(): Promise<Blob> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/trips/export`, {
    headers: {
      'X-Session-Id': getSessionId()
    }
  });
  if (!response.ok) {
    throw new Error('Export failed');
  }
  return response.blob();
}

export const tripService = {
  getAll: getTrips,
  getById: getTripById,
  create: postTrip,
  update: updateTrip,
  delete: deleteTrip,
  import: importTrips,
  export: exportTrips
};

