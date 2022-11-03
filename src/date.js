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
    for (let monthName = 0; monthName < monthNames.length; monthName++) {
      if (monthNames[monthName] === string.toLowerCase()) return monthName;
      continue;
    }
  }
  formatDate(year, month, day) {
    let date = new Date(year, month, day);
    return format(date, "MMM. d yyy");
  }
}
