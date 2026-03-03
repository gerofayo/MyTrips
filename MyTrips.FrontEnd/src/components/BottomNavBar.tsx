import { NavLink } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { Icon } from "@iconify/react";
import "../styles/components/BottomNavBar.css";

interface BottomNavBarProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function BottomNavBar({ onImport, onExport }: BottomNavBarProps) {
  return (
    <div className="bottom-nav-bar">
      <div className="nav-container">
        <NavLink to="/" className="nav-item" aria-label="Home">
          <Icon icon="mdi:home" className="nav-icon" />
          <span className="nav-label">Home</span>
        </NavLink>
        
        <NavLink to={PATHS.CREATE_TRIP} className="nav-item" aria-label="Create Trip">
          <Icon icon="mdi:plus-circle" className="nav-icon" />
          <span className="nav-label">Create</span>
        </NavLink>
        
        <button className="nav-item" aria-label="Import Trips" onClick={onImport}>
          <Icon icon="mdi:import" className="nav-icon" />
          <span className="nav-label">Import</span>
        </button>
        
        <button className="nav-item" aria-label="Export Trips" onClick={onExport}>
          <Icon icon="mdi:export" className="nav-icon" />
          <span className="nav-label">Export</span>
        </button>
      </div>
    </div>
  );
}