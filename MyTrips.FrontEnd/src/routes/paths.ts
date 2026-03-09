const BASE_URL = '/trips';

export const PATHS = {

  HOME: `/`, 

  TRIPS_LIST: BASE_URL,
  TRIP_DETAILS_PATTERN: `${BASE_URL}/:id`, 
  EDIT_TRIP_PATTERN: `${BASE_URL}/edit/:id`,
  CREATE_TRIP: `${BASE_URL}/new`,
  
  // Trip sub-pages
  TRIP_MAP_PATTERN: `${BASE_URL}/:id/map`,
  TRIP_PHOTOS_PATTERN: `${BASE_URL}/:id/photos`,

  // Budget item pages
  ADD_EXPENSE_PATTERN: `${BASE_URL}/:tripId/expense/new`,
  EDIT_EXPENSE_PATTERN: `${BASE_URL}/:tripId/expense/:itemId/edit`,


  TRIP_DETAILS: (id: string) => `${BASE_URL}/${id}`,
  EDIT_TRIP: (id: string) => `${BASE_URL}/edit/${id}`,
  TRIP_MAP: (id: string) => `${BASE_URL}/${id}/map`,
  TRIP_PHOTOS: (id: string) => `${BASE_URL}/${id}/photos`,

  ADD_EXPENSE: (tripId: string) => `${BASE_URL}/${tripId}/expense/new`,
  EDIT_EXPENSE: (tripId: string, itemId: string) => `${BASE_URL}/${tripId}/expense/${itemId}/edit`,

} as const;
