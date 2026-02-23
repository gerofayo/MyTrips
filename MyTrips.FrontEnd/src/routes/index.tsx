import type { RouteObject } from "react-router-dom";
import TripDetailPage from "../pages/TripDetailPage";
import TripFormPage from "../pages/TripFormPage";
import TripListPage from "../pages/TripListPage";
import { PATHS } from "./paths";

export const routes: RouteObject[] = [
  { path: PATHS.HOME, element: <TripListPage /> },
  { path: PATHS.TRIPS_LIST, element: <TripListPage /> },
  { path: PATHS.TRIP_DETAILS_PATTERN, element: <TripDetailPage /> },
  { path: PATHS.EDIT_TRIP_PATTERN, element: <TripFormPage /> },
  { path: PATHS.CREATE_TRIP, element: <TripFormPage /> },
];