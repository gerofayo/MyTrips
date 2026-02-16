import { apiClient } from "../api/apiClient";
import type { TripResponse, CreateTripRequest } from "../types/Trip";

const API_URL = "http://localhost:5234/api/trips";

export async function getTrips(): Promise<TripResponse[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error fetching trips");
  }

  return response.json();
}

export async function getTripById(id: string): Promise<TripResponse> {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error fetching trip by ID");
  }

  return response.json();
}

export async function postTrip(
  createTripRequest: CreateTripRequest
): Promise<TripResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTripRequest),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error creating trip");
  }

  return response.json();
}

export async function deleteTrip(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error deleting trip");
  }
}

export const getCurrencies = () => apiClient.get<string[]>("/trips/currencies");


