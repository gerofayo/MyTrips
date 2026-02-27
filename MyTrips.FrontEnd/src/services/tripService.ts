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

export async function importTrips(file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  return fetch(`${import.meta.env.VITE_API_URL}/trips/import`, {
    method: 'POST',
    body: formData
  }).then(res => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });
}

export async function exportTrips(): Promise<Blob> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/trips/export`);
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
