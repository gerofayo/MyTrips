

export const generateDateRange = (start: string, end: string): string[] => {
  const dates = [];
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export  const getDayName = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('us-US', { weekday: 'short' });

export  const getDayNumber = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').getDate();


export const dateUtlis = {
    generateDateRange,
    getDayName,
    getDayNumber
}