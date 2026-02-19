import { useEffect, useRef } from "react";
import { generateDateRange, getDayName, getDayNumber } from "../utils/date";

interface TripCalendarProps {
  startDate: string;     // Formato "YYYY-MM-DD"
  endDate: string;       // Formato "YYYY-MM-DD"
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export const TripCalendar = ({ startDate, endDate, selectedDate, onDateSelect }: TripCalendarProps) => {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedDate || !containerRef.current) return;

    const activeElement = containerRef.current.querySelector(".day-card.active");
    activeElement?.scrollIntoView({
      behavior: "smooth",
      inline: "center"
    });
  }, [selectedDate]);

  const days = generateDateRange(startDate, endDate);

  return (
    <div className="calendar-container">
      <span className="section-label">Trip Itirenary</span>
      <div className="calendar-strip" ref={containerRef}>
        <button
          className={`day-card ${selectedDate === null ? 'active' : ''}`}
          onClick={() => onDateSelect(null)}
        >
          <span className="day-name">View</span>
          <span className="day-number">All</span>
        </button>
        {days.map((day) => (
          <button
            key={day}
            className={`day-card ${selectedDate === day ? 'active' : ''}`}
            onClick={() => onDateSelect(day)}
          >
            <span className="day-name">{getDayName(day).toUpperCase()}</span>
            <span className="day-number">{getDayNumber(day)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};