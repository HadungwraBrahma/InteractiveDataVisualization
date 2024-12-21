import { format, parseISO, isValid } from "date-fns";

export const safeFormatDate = (dateString) => {
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? format(parsedDate, "dd-MMM") : "Invalid Date";
  } catch (err) {
    console.error("Date formatting error:", err);
    return "Invalid Date";
  }
};