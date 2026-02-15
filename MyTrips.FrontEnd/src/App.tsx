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
          <Route path="/" element={<TripListPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/create" element={<TripFormPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
