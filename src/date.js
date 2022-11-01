import { format } from "date-fns";
import { isThisYear } from "date-fns";

export class DateFnsTemp {
  parseMonthInt(string) {
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    for (let i = 0; i <= monthNames.length; i++) {
      if (monthNames[i] === string.toLowerCase()) return i;
      continue;
    }
  }
  formatDate(year, month, day) {
    let date = new Date(year, month, day);
    if (isThisYear(date)) return format(date, "MMM. d");
    return format(date, "MM/dd/yyyy");
  }
}
