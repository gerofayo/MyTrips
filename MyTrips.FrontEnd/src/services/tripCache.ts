import type { TripResponse } from "../types/Trip";
import { getSessionId } from "../api/apiClient";

const CACHE_PREFIX = "mytrips_cache_";

interface CacheData {
  trips: TripResponse[];
}

function getCacheKey(): string {
  const sessionId = getSessionId();
  return `${CACHE_PREFIX}${sessionId}`;
}

export function getTripsFromCache(): TripResponse[] | null {
  try {
    const key = getCacheKey();
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const data: CacheData = JSON.parse(cached);
    return data.trips;
  } catch (error) {
    console.error("Error reading trips from cache:", error);
    return null;
  }
}

export function setTripsToCache(trips: TripResponse[]): void {
  try {
    const key = getCacheKey();
    const data: CacheData = {
      trips
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving trips to cache:", error);
  }
}

export function clearTripsCache(): void {
  try {
    const key = getCacheKey();
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing trips cache:", error);
  }
}

export function getTripsFromCacheWithoutExpiration(): TripResponse[] | null {
  return getTripsFromCache();
}

export function createTripsJsonFile(trips: TripResponse[]): File {
  const json = JSON.stringify(trips, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  return new File([blob], "mytrips_export.json", { type: "application/json" });
}

