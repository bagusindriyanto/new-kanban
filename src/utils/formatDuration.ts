export const formatDuration = (minutes: number): string => {
  if (!minutes || minutes === 0) return '0m';

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}j`;
  }

  return `${hours}j ${remainingMinutes}m`;
};
