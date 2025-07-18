
export const isWithinAttendanceWindow = (): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Check if current time is between 8:00 AM and 9:00 AM
  const startTime = 11 * 60; // 8:00 AM in minutes
  const endTime = 12 * 60;   // 9:00 AM in minutes
  const currentTime = currentHour * 60 + currentMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
};

export const getTimeUntilAttendanceWindow = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0); // Set to 8:00 AM tomorrow
  
  return tomorrow.getTime() - now.getTime();
};

export const getAttendanceCountdown = (): string => {
  const now = new Date();
  const endTime = new Date(now);
  endTime.setHours(9, 0, 0, 0); // 9:00 AM today
  
  if (now > endTime) {
    return "Attendance window closed";
  }
  
  const diff = endTime.getTime() - now.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
