import { useEffect, useRef } from "react";

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

  const generateDays = () => {
    const days = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split('T')[0]);
    }
    return days;
  };

  const days = generateDays();

  const getDayName = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('us-US', { weekday: 'short' });

  const getDayNumber = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').getDate();

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