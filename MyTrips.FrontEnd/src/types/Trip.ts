export type CreateTripRequest = {
  title: string;
  destination: string;
  destinationTimezone: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
};

export type TripResponse = {
  id: string;
  title: string;
  destination: string;
  destinationTimezone: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  createdAt: string;
};
