import { calculateDayIncome } from "./calculations";
import { getActiveProjectName } from "./project";
import { Calendar } from "./state";
import { createElement } from "./util";

export type DayType = "weekday" | "saturday" | "sunday" | "inactive";

export enum DayTypeEnum {
  Weekday = "weekday",
  Saturday = "saturday",
  Sunday = "sunday",
  Inactive = "inactive",
}

const currentDate = new Date();

export type MonthState = {
  month: number;
  values: string[];
};

export const renderCalendar = (
  calendar: Calendar,
  monthStates?: MonthState[]
) => {
  console.log("monthStates", monthStates);
  const table = createElement("table", "table") as HTMLTableElement;
  table.setAttribute("data-projects", "");
  const caption = createElement("caption");
  caption.textContent = currentDate.toLocaleString(
    calendar.locale,
    calendar.dateFormat
  );
  table.appendChild(caption);
  const thead = createElement("thead");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  days.forEach((day) => {
    const element = createElement("th");
    element.textContent = day;
    thead.appendChild(element);
  });
  const tbodyMonths = renderMonth(monthStates);
  table.appendChild(thead);
  table.appendChild(tbodyMonths);
  return table;
};

const renderMonth = (monthStates?: MonthState[]) => {
  const currentMonth = new Date().getMonth();
  const monthState = monthStates?.find(
    (monthState) => currentMonth === monthState.month
  );
  const numOfDays = dateMapper[currentMonth] || 0;

  let numOfWeeks = Math.ceil(numOfDays / 7);
  const startDayOfMonth = getStartDay();
  if (startDayOfMonth > 4 && numOfDays === 31) {
    // 31 days month starting sat or sun needs an extra week
    numOfWeeks = 6;
  }

  const lastDayOfMonth = getLastDay();
  let date = 1;
  const tbody = createElement("tbody", "tbody");
  for (let week = 0; week < numOfWeeks; week++) {
    let row = createElement("tr");
    if (week === 0) {
      // Render correct day 1
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek < startDayOfMonth) {
          row.appendChild(
            renderDay(0, dayOfWeek, currentMonth, "inactive", monthState)
          );
        } else {
          row.appendChild(
            renderDay(date, dayOfWeek, currentMonth, "active", monthState)
          );
          date++;
        }
      }
    } else if (week === numOfWeeks - 1) {
      // Render correct last day
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek <= lastDayOfMonth) {
          row.appendChild(
            renderDay(date, dayOfWeek, currentMonth, "active", monthState)
          );
          date++;
        } else {
          row.appendChild(
            renderDay(0, dayOfWeek, currentMonth, "inactive", monthState)
          );
        }
      }
    } else {
      let dayOfWeek = 0;
      while (dayOfWeek < 7) {
        row.appendChild(
          renderDay(date, dayOfWeek, currentMonth, "active", monthState)
        );
        date++;
        dayOfWeek++;
      }
    }
    tbody.appendChild(row);
  }
  return tbody;
};

const getStartDay = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth()
  ).getUTCDay();
  return firstDayOfMonth;
};

const getLastDay = () => {
  const today = new Date();
  const month = today.getMonth();
  const numOfDays = dateMapper[month];
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    numOfDays
  );
  return lastDayOfMonth.getUTCDay();
};

const numOfDaysInFebruary = () => {
  const year = new Date().getFullYear();
  if (year % 4 === 0) {
    if (year % 100 === 0 && year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }
};

const dateMapper = [
  31,
  numOfDaysInFebruary(),
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

const renderDay = (
  date: number,
  dayOfWeek: number,
  currentMonth: number,
  type: "active" | "inactive" = "active",
  monthState?: MonthState
) => {
  const td = createElement("td");
  const input = createElement(
    "input",
    `date-input-${date}`
  ) as HTMLInputElement;
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", date.toString());
  input.setAttribute("data-day-type", DayTypeEnum.Weekday);

  input.addEventListener("keypress", (event) => {
    if (input.readOnly) {
      return;
    }
    const key = event.key.toLocaleLowerCase();
    if (key === "f") {
      event.preventDefault(); // Stop "change" event from firing
      setHoursAndIncome(input, event, "7.5");
    } else if (key === "d") {
      event.preventDefault(); // Stop "change" event from firing
      setHoursAndIncome(input, event, "0");
    }
  });
  input.addEventListener("change", (event) => {
    setHoursAndIncome(input, event);
  });

  const isWeekend = dayOfWeek > 4 && type !== "inactive";
  let className = "calendar-day";
  if (type === DayTypeEnum.Inactive) {
    input.classList.add("inactive");
    input.setAttribute("data-day-type", DayTypeEnum.Inactive);
    input.disabled = true;
  } else {
    if (currentMonth === monthState?.month && monthState?.values[date - 1]) {
      input.value = monthState.values[date - 1];
      input.setAttribute(
        `data-project-${getActiveProjectName()}-hours`,
        monthState.values[date - 1]
      );
    }
    if (isWeekend) {
      if (dayOfWeek === 5) {
        input.setAttribute("data-day-type", DayTypeEnum.Saturday);
      } else {
        input.setAttribute("data-day-type", DayTypeEnum.Sunday);
      }
      input.classList.add("calendar-day");
      input.classList.add("weekend");
    } else {
      input.classList.add(className);
    }
  }

  td.appendChild(input);

  return td;
};

const setHoursAndIncome = (
  input: HTMLInputElement,
  event: Event,
  hours?: string
) => {
  const target = event.target as HTMLInputElement;
  const value = hours ? hours : target.value;
  input.value = value;
  const activeProject = getActiveProjectName();
  input.setAttribute(`data-project-${activeProject}-hours`, value);
  input.setAttribute(
    `data-project-${activeProject}-income`,
    Math.floor(calculateDayIncome(input)).toString()
  );
};
