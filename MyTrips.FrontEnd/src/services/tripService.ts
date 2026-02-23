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
  return apiClient.post<TripResponse>("/trips", createTripRequest);
}

export async function updateTrip(
  id: string, 
  data: Partial<CreateTripRequest>
): Promise<TripResponse> {
  return apiClient.put<TripResponse>(`/trips/${id}`, data);
}

export async function deleteTrip(id: string): Promise<void> {
  return apiClient.delete(`/trips/${id}`);
}

export const tripService = {
  getAll: getTrips,
  getById: getTripById,
  create: postTrip,
  update: updateTrip,
  delete: deleteTrip,
};