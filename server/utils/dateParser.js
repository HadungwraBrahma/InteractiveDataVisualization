export const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const parseDate2 = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
