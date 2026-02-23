import { NavLink } from "react-router-dom";

export default function Navbar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <NavLink to="/trips" style={{ textDecoration: 'none' }}>
          <h2 className="navbar-logo">Trip Planner</h2>
        </NavLink>

        <div className="navbar-links">
          <NavLink 
            to="/trips" 
            className={getLinkClass}
            end
          >
            My Trips
          </NavLink>
          
          <NavLink 
            to="/trips/new" 
            className={getLinkClass}
          >
            Plan New Trip
          </NavLink>
        </div>
      </div>
    </nav>
  );
}