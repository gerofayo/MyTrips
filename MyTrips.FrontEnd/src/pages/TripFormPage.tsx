import TripForm from "../components/TripForm";
import { useTrips } from "../hooks/useTrips";
import { useNavigate } from "react-router-dom";
import type { CreateTripRequest } from "../types/Trip";

export default function TripFormPage() {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateTripRequest) => {
    await createTrip(data);
    navigate("/trips");
  };

  return (
    <div className="create-trip-page">
      <h1>Create New Trip</h1>
      <TripForm onSubmit={handleCreate} />
    </div>
  );
}
