import TripForm from "../components/TripForm";
import { useTrips } from "../hooks/useTrips";
import { useNavigate } from "react-router-dom";

export default function TripFormPage() {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    await createTrip(data);
    navigate("/");
  };

  return (
    <div className="create-trip-page">
      <h1>Create New Trip</h1>
      <TripForm onSubmit={handleCreate} />
    </div>
  );
}
