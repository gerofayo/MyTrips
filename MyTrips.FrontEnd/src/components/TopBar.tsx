import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { PATHS } from "../routes/paths";
import ThemeToggle from "./ThemeToggle";
import "../styles/components/TopBar.css";

export default function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-container">
        <NavLink to={PATHS.TRIPS_LIST} className="top-bar-brand">
          <Icon icon="mdi:airplane-takeoff" className="brand-icon" />
          <span className="brand-text">MyTrips</span>
        </NavLink>
        
        <nav className="top-bar-nav">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

