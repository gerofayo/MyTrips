import { apiClient, getSessionId } from "../api/apiClient";
import type { TripResponse, CreateTripRequest } from "../types/Trip";
import { 
  getTripsFromCache, 
  setTripsToCache, 
  getTripsFromCacheWithoutExpiration,
  createTripsJsonFile
} from "./tripCache";
import { logger } from "../utils/logger";

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
      try {
        await importFromCache(cachedTrips);
        // After import, fetch fresh data from API and update cache
        const refreshedTrips = await apiClient.get<TripResponse[]>("/trips");
        if (refreshedTrips && refreshedTrips.length > 0) {
          setTripsToCache(refreshedTrips);
          return refreshedTrips;
        }
      } catch (importError) {
        logger.error("Failed to import cached trips", importError);
      }
      // Return cached trips if import failed
      return cachedTrips;
    }
    
    // No cached data, return empty
    return [];
  } catch (error) {
    // API error - return cached data if available
    if (cachedTrips && cachedTrips.length > 0) {
      logger.warn("API error, returning cached trips");
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
    logger.error("Failed to import cached trips", error);
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
    logger.error("Delete trip failed", error);
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
      // Try to get the actual error message from the response body
      const errorText = await res.text().catch(() => null);
      throw new Error(errorText || res.statusText);
    }
    const result = await res.json();
    
    // After import, ALWAYS refresh cache from API to ensure consistency
    // Even if the API call fails, we should try to sync
    try {
      const apiTrips = await apiClient.get<TripResponse[]>("/trips");
      if (apiTrips) {
        setTripsToCache(apiTrips);
      }
    } catch (syncError) {
      // If sync fails, log but don't throw - import was successful
      logger.warn("Failed to sync cache after import, will retry on next load", syncError);
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

