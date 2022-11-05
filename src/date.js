import { format, isAfter, isBefore, isEqual } from "date-fns";

export class dTemp {
  static getDateNow() {
    let date = new Date();
    const dateNow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return dateNow;
  }

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

  isDateNow(taskDate) {
    const result = isEqual(new Date(...taskDate), dTemp.getDateNow());
    return result;
  }

  isPastDue(taskDate) {
    const result = isBefore(new Date(...taskDate), dTemp.getDateNow());
    return result;
  }

  isNotDue(taskDate) {
    const result = isAfter(new Date(...taskDate), dTemp.getDateNow());
    return result;
  }
}
