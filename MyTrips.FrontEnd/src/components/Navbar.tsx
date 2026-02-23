import { NavLink } from "react-router-dom";
import { PATHS } from "../routes/paths";
import "../styles/components/Navbar.css";

export default function Navbar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <NavLink to={PATHS.HOME} style={{ textDecoration: 'none' }}>
          <h2 className="navbar-logo">MyTrips</h2>
        </NavLink>

        <div className="navbar-links">
          <NavLink 
            to={PATHS.TRIPS_LIST} 
            className={getLinkClass}
            end
          >
            Trips
          </NavLink>
          
          <NavLink 
            to={PATHS.CREATE_TRIP} 
            className={`${getLinkClass({ isActive: false })} nav-link-button`}
          >
            Plan New Trip
          </NavLink>
        </div>
      </div>
    </nav>
  );
}