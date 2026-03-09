import type { RouteObject } from "react-router-dom";
import TripDetailPage from "../pages/TripDetailPage";
import TripFormPage from "../pages/TripFormPage";
import TripListPage from "../pages/TripListPage";
import ExpenseFormPage from "../pages/ExpenseFormPage";
import { PATHS } from "./paths";

export const routes: RouteObject[] = [
  { path: PATHS.HOME, element: <TripListPage /> },
  { path: PATHS.TRIPS_LIST, element: <TripListPage /> },
  { path: PATHS.TRIP_DETAILS_PATTERN, element: <TripDetailPage /> },
  { path: PATHS.EDIT_TRIP_PATTERN, element: <TripFormPage /> },
  { path: PATHS.CREATE_TRIP, element: <TripFormPage /> },
  { path: PATHS.ADD_EXPENSE_PATTERN, element: <ExpenseFormPage /> },
  { path: PATHS.EDIT_EXPENSE_PATTERN, element: <ExpenseFormPage /> },
];
