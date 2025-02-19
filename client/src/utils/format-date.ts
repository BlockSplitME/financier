import { format } from "date-fns";

export const formatDate = {
  getDateForDatePicker(date: number | string): string {
    const dateObj = new Date(date);
    return `${dateObj.getFullYear() + 1}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
  },
  getDateForTable(date: Date | string | number): string {
    if (!date) return "";

    const dateObj = new Date(date);
    return format(dateObj, "dd.MM.yy");
  },
};
