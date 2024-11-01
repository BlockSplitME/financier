export const formatDate = {
  getDateForDatePicker (date: number | string): string {
    const dateObj = new Date(date)
    return `${dateObj.getFullYear() + 1}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
  },
}
