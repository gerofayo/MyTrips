export type BaseTrip = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
};

export type TripResponse = BaseTrip & {
  id: string;
  createdAt: string;
};

export type CreateTripDto = BaseTrip;
