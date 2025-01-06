import { calculateDayIncome } from "./calculations";
import { Calendar } from "./guiState";
import { getActiveProjectName } from "./project";
import { MonthState, YearState } from "./state";
import { createElement } from "./util";

export type DayType = "weekday" | "saturday" | "sunday" | "inactive";

export enum DayTypeEnum {
  Weekday = "weekday",
  Saturday = "saturday",
  Sunday = "sunday",
  Inactive = "inactive",
}

export const renderCalendar = (date: Date, yearStates?: YearState[]) => {
  console.log("date", date);

  const table = createElement("table", "table") as HTMLTableElement;
  table.setAttribute("data-projects", "");
  table.setAttribute("data-year", date.getFullYear().toString());
  table.setAttribute("data-month", date.getMonth().toString());

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
  const tbodyMonths = renderMonth(date, yearStates);
  table.appendChild(thead);
  table.appendChild(tbodyMonths);
  return table;
};

export const renderHeader = (date: Date, calendar: Calendar) => {
  const container = createElement("div");
  container.className = "caption-container";
  const previousMonth = createElement(
    "button",
    "previousMonth",
  ) as HTMLButtonElement;
  previousMonth.textContent = "<<";
  previousMonth.addEventListener("click", (event) => onClick(event, date));
  const nextMonth = createElement("button", "nextMonth") as HTMLButtonElement;
  nextMonth.textContent = ">>";
  nextMonth.addEventListener("click", (event) => onClick(event, date));
  const caption = createElement("h2");
  caption.textContent = date.toLocaleString(
    calendar.locale,
    calendar.dateFormat,
  );
  container.appendChild(previousMonth);
  container.appendChild(caption);
  container.appendChild(nextMonth);
  return container;
};

const onClick = (event: MouseEvent, date: Date) => {
  const target = event.target as HTMLElement;

  const calendar = document.getElementById("table");

  let activeMonth = date.getMonth();
  let activeYear = date.getFullYear();
  if (target.id === "previousMonth") {
    if (activeMonth === 0) {
      activeYear--;
      activeMonth = 11;
    } else {
      activeMonth--;
    }
    console.log("going backwards to", activeMonth, activeYear);
  } else {
    if (activeMonth === 11) {
      activeYear++;
      activeMonth = 0;
    } else {
      activeMonth++;
    }
    console.log("going forwards to ", activeMonth, activeYear);
  }
  if (calendar) {
    calendar.setAttribute("data-year", activeYear.toString());
    calendar.setAttribute("data-month", activeMonth.toString());
  }
};

const renderMonth = (date: Date, yearStates?: YearState[]) => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const monthStates = yearStates?.find(
    (yearState) => currentYear === yearState.year,
  )?.monthStates;

  const monthState = monthStates?.find(
    (monthState) => currentMonth === monthState.month,
  );

  const numOfDays = dateMapper(date) || 0;

  let numOfWeeks = Math.ceil(numOfDays / 7);
  console.log("nun", numOfWeeks);

  const startDayOfMonth = getStartDay(date);
  if (startDayOfMonth > 4 && numOfDays === 31) {
    // 31 days month starting sat or sun needs an extra week
    numOfWeeks = 6;
  } else if (startDayOfMonth > 5 && numOfDays === 30) {
    // 30+ days month staring sunday needs an extra week
    numOfWeeks = 6;
  } else if (startDayOfMonth > 0 && date.getMonth() === 1) {
    // February special case
    numOfWeeks = 5;
  }

  const lastDayOfMonth = getLastDay(date);
  let currentDate = 1;
  const tbody = createElement("tbody", "tbody");
  for (let week = 0; week < numOfWeeks; week++) {
    let row = createElement("tr");
    if (week === 0) {
      // Render correct day 1
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek < startDayOfMonth) {
          row.appendChild(
            renderDay(0, dayOfWeek, currentMonth, "inactive", monthState),
          );
        } else {
          row.appendChild(
            renderDay(
              currentDate,
              dayOfWeek,
              currentMonth,
              "active",
              monthState,
            ),
          );
          currentDate++;
        }
      }
    } else if (week === numOfWeeks - 1) {
      // Render correct last day
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek <= lastDayOfMonth) {
          row.appendChild(
            renderDay(
              currentDate,
              dayOfWeek,
              currentMonth,
              "active",
              monthState,
            ),
          );
          currentDate++;
        } else {
          row.appendChild(
            renderDay(0, dayOfWeek, currentMonth, "inactive", monthState),
          );
        }
      }
    } else {
      let dayOfWeek = 0;
      while (dayOfWeek < 7) {
        row.appendChild(
          renderDay(currentDate, dayOfWeek, currentMonth, "active", monthState),
        );
        currentDate++;
        dayOfWeek++;
      }
    }
    tbody.appendChild(row);
  }
  return tbody;
};

const getStartDay = (date: Date) => {
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
  ).getUTCDay();
  return firstDayOfMonth;
};

const getLastDay = (date: Date) => {
  const month = date.getMonth();
  const numOfDays = dateMapper(date);
  const lastDayOfMonth = new Date(date.getFullYear(), month, numOfDays);
  return lastDayOfMonth.getUTCDay();
};

const numOfDaysInFebruary = (date: Date) => {
  const year = date.getFullYear();
  if (year % 4 === 0) {
    if (year % 100 === 0 && year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  } else {
    return 28;
  }
};

const dateMapper = (date: Date) => {
  const currentMonth = date.getMonth();
  const mapping = [
    31,
    numOfDaysInFebruary(date),
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

  return mapping[currentMonth];
};

const renderDay = (
  date: number,
  dayOfWeek: number,
  currentMonth: number,
  type: "active" | "inactive" = "active",
  monthState?: MonthState,
) => {
  const td = createElement("td");
  const input = createElement(
    "input",
    `date-input-${date}`,
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
    if (currentMonth === monthState?.month && monthState?.hours[date - 1]) {
      input.value = monthState.hours[date - 1];
      input.setAttribute(
        `data-project-${getActiveProjectName()}-hours`,
        monthState.hours[date - 1],
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
  hours?: string,
) => {
  const target = event.target as HTMLInputElement;
  const value = hours ? hours : target.value;
  input.value = value;
  const activeProject = getActiveProjectName();
  input.setAttribute(`data-project-${activeProject}-hours`, value);
  input.setAttribute(
    `data-project-${activeProject}-income`,
    Math.floor(calculateDayIncome(input)).toString(),
  );
};
