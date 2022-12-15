export const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleString('en', {
    month: 'short',
  })}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

export const formatDateSlash = (timestamp: Date | string) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth()}`;
};
