import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-logo">Trip Planner</h2>

        <div className="navbar-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/trips" className="nav-link">
            Trips
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
