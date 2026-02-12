import type { Trip } from "../types/Trip";

const API_URL = "http://localhost:5234/api/trips";

export async function getTrips(): Promise<Trip[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error fetching trips");
  }

  return response.json();
}

