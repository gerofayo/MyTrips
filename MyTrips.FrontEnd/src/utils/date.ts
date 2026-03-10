export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  // Use UTC to ensure consistent date generation regardless of system timezone
  let current = Date.UTC(
    parseInt(startDate.split('-')[0]),
    parseInt(startDate.split('-')[1]) - 1,
    parseInt(startDate.split('-')[2])
  );
  const endTime = Date.UTC(
    parseInt(endDate.split('-')[0]),
    parseInt(endDate.split('-')[1]) - 1,
    parseInt(endDate.split('-')[2])
  );

  while (current <= endTime) {
    const d = new Date(current);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
    
    current += 24 * 60 * 60 * 1000; // Add one day in milliseconds
  }
  return dates;
};

export const getDayName = (dateString: string) => {
  // Parse date as UTC to ensure consistent behavior regardless of system timezone
  const [year, month, day] = dateString.split('-').map(Number);
  const date = Date.UTC(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    timeZone: 'UTC'
  }).format(date);
};

export const getDayNumber = (dateString: string) => {
  // Parse date as UTC to ensure consistent behavior regardless of system timezone
  const [year, month, day] = dateString.split('-').map(Number);
  const date = Date.UTC(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    timeZone: 'UTC'
  }).format(date);
};

export const isDateInRange = (dateString: string, startDate: string, endDate: string) => {
  return dateString >= startDate && dateString <= endDate;
};

// Parse a date string as UTC timestamp (for consistent handling regardless of system timezone)
export const parseDateAsUTC = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

// Extract date part from ISO datetime string
export const getDatePart = (isoDate: string | null | undefined): string | null => {
  if (!isoDate) return null;
  return isoDate.split('T')[0];
};

