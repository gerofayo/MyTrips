import { useEffect, useRef } from "react";
import { generateDateRange, getDayName, getDayNumber } from "../utils/date";
import type { BudgetItem } from "../types/BudgetItem";

interface TripCalendarProps {
  startDate: string;
  endDate: string;
  selectedDate: string | null;
  destinationTimezone: string;
  items?: BudgetItem[];
  onDateSelect: (date: string | null) => void;
}

export const TripCalendar = ({
  startDate,
  endDate,
  selectedDate,
  destinationTimezone,
  onDateSelect
}: TripCalendarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedDate || !containerRef.current) return;
    
    // Buscamos el elemento activo para centrarlo automáticamente al seleccionarlo
    const activeElement = containerRef.current.querySelector(".day-card.active");
    if (activeElement) {
      activeElement.scrollIntoView({ 
        behavior: "smooth", 
        inline: "center", 
        block: "nearest" 
      });
    }
  }, [selectedDate]);

  if (!startDate || !endDate) return null;

  const days = generateDateRange(startDate, endDate);

  return (
    <div className="calendar-container">
      <span className="section-label">Trip Schedule</span>
      <div className="calendar-strip" ref={containerRef}>
        
        <button
          type="button"
          className={`day-card ${selectedDate === null ? 'active' : ''}`}
          onClick={() => onDateSelect(null)}
        >
          <span className="day-name">VIEW</span>
          <span className="day-number">All</span>
        </button>

        {days.map((day) => {
          const dayName = getDayName(day, destinationTimezone);
          const dayNumber = getDayNumber(day, destinationTimezone);

          return (
            <button
              type="button"
              key={day}
              className={`day-card ${selectedDate === day ? 'active' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              <span className="day-name">
                {dayName.toUpperCase()}
              </span>
              <span className="day-number">
                {dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};