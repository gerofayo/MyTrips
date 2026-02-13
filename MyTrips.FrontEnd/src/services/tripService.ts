import type { TripResponse , CreateTripDto} from "../types/TripResponse";

const API_URL = "http://localhost:5234/api/trips";

export async function getTrips(): Promise<TripResponse[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error fetching trips");
  }

  return response.json();
}

export async function createTrip(createTripDto: CreateTripDto): Promise<TripResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTripDto),
  });

  if (!response.ok) {
    throw new Error("Error creating trip");
  }

  return response.json();
}

export async function postTrip(createTripDto: CreateTripDto): Promise<TripResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTripDto),
  });

  if (!response.ok) {
    throw new Error("Error posting trip");
  }
  
  return response.json();
}

export async function deleteTrip(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Error deleting trip");
  }
}
