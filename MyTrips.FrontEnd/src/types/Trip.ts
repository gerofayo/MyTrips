import type { BudgetItem } from "./BudgetItem";

export type CreateTripRequest = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  imageUrl?: string;
};

export type TripResponse = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  imageUrl?: string;
  createdAt: string;
  budgetItems: BudgetItem[];
};

