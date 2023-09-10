import { createElement } from "./util";

const currentDate = new Date();

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

const renderMonth = () => {
  const numOfDays = dateMapper[new Date().getMonth()] || 0;
  const numOfWeeks = Math.ceil(numOfDays / 7);
  const startDayOfMonth = getStartDay();
  const lastDayOfMonth = getLastDay();
  let date = 1;
  const tbody = createElement("tbody", "tbody");
  for (let week = 0; week < numOfWeeks; week++) {
    let row = createElement("tr");
    if (week === 0) {
      // Render correct day 1
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek < startDayOfMonth) {
          row.appendChild(renderDay(0, dayOfWeek, "inactive"));
        } else {
          row.appendChild(renderDay(date, dayOfWeek));
          date++;
        }
      }
    } else if (week === numOfWeeks - 1) {
      // Render correct last day
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek <= lastDayOfMonth) {
          row.appendChild(renderDay(date, dayOfWeek));
          date++;
        } else {
          row.appendChild(renderDay(0, dayOfWeek, "inactive"));
        }
      }
    } else {
      let dayOfWeek = 0;
      while (dayOfWeek < 7) {
        row.appendChild(renderDay(date, dayOfWeek));
        date++;
        dayOfWeek++;
      }
    }
    tbody.appendChild(row);
  }
  return tbody;
};

const renderDay = (
  date: number,
  dayOfWeek: number,
  type: "active" | "inactive" = "active"
) => {
  const td = createElement("td");
  const input = createElement(
    "input",
    `date-input-${date}`
  ) as HTMLInputElement;
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", date.toString());
  input.setAttribute("data-day-type", "weekday");
  input.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      input.value = target.value;
      // input.textContent = target.value;
      const table = document.getElementById("table");
      const activeProject = table?.getAttribute("data-active-project");
      input.setAttribute(`data-project-${activeProject}-value`, target.value);
    }
  });

  const isWeekend = dayOfWeek > 4 && type !== "inactive";
  let className = "calendar-day";
  if (isWeekend) {
    className = "calendar-day-weekend";
    if (dayOfWeek === 5) {
      input.setAttribute("data-day-type", "saturday");
    } else {
      input.setAttribute("data-day-type", "sunday");
    }
  } else if (type === "inactive") {
    className = "calendar-day-inactive";
    input.setAttribute("data-day-type", "inactive");
  }
  input.classList.add(className);
  td.appendChild(input);

  return td;
};

export const renderCalendar = () => {
  const table = createElement("table", "table");
  table.setAttribute("data-active-project", "Default");
  const caption = createElement("caption");
  caption.textContent = currentDate.toLocaleString("en-GB", { month: "long" });
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
  const tbodyMonths = renderMonth();
  table.appendChild(thead);
  table.appendChild(tbodyMonths);
  return table;
};
