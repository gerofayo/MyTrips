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


  TRIP_DETAILS: (id: string) => `${BASE_URL}/${id}`,
  EDIT_TRIP: (id: string) => `${BASE_URL}/edit/${id}`,
  TRIP_MAP: (id: string) => `${BASE_URL}/${id}/map`,
  TRIP_PHOTOS: (id: string) => `${BASE_URL}/${id}/photos`,

} as const;
