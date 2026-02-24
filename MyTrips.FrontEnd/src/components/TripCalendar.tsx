import { useEffect, useRef } from "react";
import { generateDateRange, getDayName, getDayNumber } from "../utils/date";
import { TEXTS } from "../config/texts";
import "../styles/components/TripCalendar.css";

interface TripCalendarProps {
  startDate: string;
  endDate: string;
  selectedDate: string | null;
  destinationTimezone: string;
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
      <span className="section-label">{TEXTS.tripCalendar.sectionLabel}</span>
      <div className="calendar-strip" ref={containerRef}>
        
        <button
          type="button"
          className={`day-card ${selectedDate === null ? 'active' : ''}`}
          onClick={() => onDateSelect(null)}
        >
          <span className="day-name">{TEXTS.tripCalendar.viewAllLabel}</span>
          <span className="day-number">{TEXTS.tripCalendar.viewAllNumber}</span>
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