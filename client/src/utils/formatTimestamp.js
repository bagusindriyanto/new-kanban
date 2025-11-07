export const formatTimestamp = (ts) => {
  const timestamp = new Date(ts);
  const date = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(timestamp);

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(timestamp);

  return date + ', ' + time;
};
