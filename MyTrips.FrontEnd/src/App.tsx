import "./App.css";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import { useTrips } from "./hooks/useTrips";

function App() {
  const {
    trips,
    loading,
    error,
    createTrip,
    removeTrip,
  } = useTrips();

  return (
    <div className="app-container">
      <h1>Trips</h1>
      <TripList trips={trips} onDelete={removeTrip} />
      {loading && <p>Loading trips...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <hr className="divider-line" />
      <TripForm onSubmit={createTrip} />

    </div>
  );
}

export default App;