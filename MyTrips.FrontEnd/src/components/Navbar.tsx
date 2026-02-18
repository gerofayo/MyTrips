import { NavLink } from "react-router-dom";

export default function Navbar() {
  const activeStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <NavLink to="/trips" className="navbar-logo-link" style={{ textDecoration: 'none' }}>
          <h2 className="navbar-logo">Trip Planner</h2>
        </NavLink>

        <div className="navbar-links">
          <NavLink 
            to="/trips" 
            className={activeStyle}
          >
            My Trips
          </NavLink>
          
          <NavLink 
            to="/create" 
            className={activeStyle}
          >
            Create Trip
          </NavLink>
        </div>
      </div>
    </nav>
  );
}