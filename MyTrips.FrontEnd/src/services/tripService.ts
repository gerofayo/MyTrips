import { apiClient } from "../api/apiClient";
import type { TripResponse, CreateTripRequest } from "../types/Trip";

export async function getTrips(): Promise<TripResponse[]> {
  return apiClient.get<TripResponse[]>("/trips");
}

export async function getTripById(id: string): Promise<TripResponse> {
  return apiClient.get<TripResponse>(`/trips/${id}`);
}

export async function postTrip(
  createTripRequest: CreateTripRequest
): Promise<TripResponse> {
  console.log("Posting trip with data:", createTripRequest);
  const response = apiClient.post<TripResponse>("/trips", createTripRequest);
  console.log("Received response:", response);
  return response;
}

export async function deleteTrip(id: string): Promise<void> {
  apiClient.delete(`/trips/${id}`);
}

export const tripService = {
  getAll: getTrips,
  getById: getTripById,
  create: postTrip,
  delete: deleteTrip,
};
