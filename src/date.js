import { format, isAfter, isBefore, isEqual } from "date-fns";

export class dTemp {
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
    const result = isEqual(new Date(...taskDate), this._getDateNow());
    return result;
  }

  isPastDue(taskDate) {
    const result = isBefore(new Date(...taskDate), this._getDateNow());
    return result;
  }

  isNotDue(taskDate) {
    const result = isAfter(new Date(...taskDate), this._getDateNow());
    return result;
  }

  sortDatesToBefore(currentTask, nextTask) {
    const taskDateOne = currentTask.tDueDate;
    const taskDateTwo = nextTask.tDueDate;
    const result = isBefore(new Date(...taskDateOne), new Date(...taskDateTwo));
    if (result) return -1;
    else return 1;
  }

  _getDateNow() {
    let date = new Date();
    const dateNow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return dateNow;
  }
}
