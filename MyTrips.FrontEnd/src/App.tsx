import { Route, Routes } from "react-router-dom";
import TripDetailPage from "./pages/TripDetailPage";
import TripListPage from "./pages/TripListPage";
import Navbar from "./components/Navbar";
import TripFormPage from "./pages/TripFormPage";

function App() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/trips" element={<TripListPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/new" element={<TripFormPage />} />
          <Route path="/trips/edit/:id" element={<TripFormPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
