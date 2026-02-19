export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const getDayName = (dateString: string, timezone: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    timeZone: timezone 
  }).format(date);
};

export const getDayNumber = (dateString: string, timezone: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    timeZone: timezone 
  }).format(date);
};

export const isDateInRange = (dateString: string, startDate: string, endDate: string) => {
  return dateString >= startDate && dateString <= endDate;
};