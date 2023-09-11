// src/util.ts
var createElement = (tagName, id) => {
  const element = document.createElement(tagName);
  if (id) {
    element.setAttribute("id", id);
  }
  return element;
};
var getActiveProjectName = () => document.getElementById("table")?.getAttribute("data-active-project")?.toLocaleLowerCase() || "default";

// src/observer.ts
var RecordType;
(function(RecordType2) {
  RecordType2["AttributeChange"] = "attributes";
  RecordType2["ChildAddRemove"] = "childList";
})(RecordType || (RecordType = {}));
var setProjectCombinedHours = (table, inputElement, totalProjectHours, oldValue) => {
  const hours = Number(inputElement.value);
  const projectHours = document.getElementById("hours-project");
  const combinedHours = document.getElementById("hours-combined");
  let newProjectHours = "";
  let newCombinedHours = "";
  const change = hours - oldValue;
  newProjectHours = (totalProjectHours + change).toString();
  newCombinedHours = (Number(combinedHours?.textContent) + change).toString();
  if (combinedHours && projectHours) {
    combinedHours.textContent = newCombinedHours;
    projectHours.textContent = newProjectHours;
    table.setAttribute(`data-project-${getActiveProjectName()}-total-hours`, newProjectHours);
  }
};
var setActiveProject = (totalProjectHours, totalProjectIncome) => {
  const projectHours = document.getElementById("hours-project");
  const projectIncome = document.getElementById("income-project");
  if (projectHours && projectIncome) {
    projectHours.textContent = totalProjectHours.toString();
    projectIncome.textContent = formatAsCurrency(totalProjectIncome);
  }
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  if (weeks) {
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            const input = day.firstChild;
            const value = input.getAttribute(`data-project-${getActiveProjectName()}-hours`);
            if (value) {
              input.value = value.toString();
            } else {
              input.value = "";
            }
          }
        });
      }
    });
  }
};
var onChangeObserver = (records) => {
  const table = document.getElementById("table");
  if (table) {
    for (const record of records) {
      switch (record.type) {
        case RecordType.ChildAddRemove:
          break;
        case RecordType.AttributeChange:
          handleAttributeChange(table, record);
          break;
        default:
          break;
      }
    }
  }
};
var handleAttributeChange = (table, record) => {
  const activeProject = getActiveProjectName();
  const projectHoursName = `data-project-${activeProject}-hours`;
  const totalProjectHours = Number(table.getAttribute(`data-project-${activeProject}-total-hours`));
  const totalProjectIncome = Number(table.getAttribute(`data-project-${activeProject}-income`));
  const isCalendarChangeEvent = record.attributeName === projectHoursName;
  const isProjectChangeEvent = record.attributeName === "data-active-project";
  if (isCalendarChangeEvent) {
    const inputElement = record.target;
    const oldValue = Number(record.oldValue);
    setProjectCombinedHours(table, inputElement, totalProjectHours, oldValue);
    const income = calculateDayIncome(inputElement, oldValue);
    setProjectCombinedIncome(income, totalProjectIncome, table);
  } else if (isProjectChangeEvent) {
    setActiveProject(totalProjectHours, totalProjectIncome);
  }
};
var calculateDayIncome = (inputElement, oldValue = 0) => {
  const hours = Number(inputElement.value);
  const dayType = inputElement.getAttribute("data-day-type");
  switch (dayType) {
    case DayTypeEnum.Weekday:
      return calculateSum(hours, "weekday", oldValue);
    case DayTypeEnum.Saturday:
      return calculateSum(hours, "saturday", oldValue);
    case DayTypeEnum.Sunday:
      return calculateSum(hours, "sunday", oldValue);
    default:
      return 0;
  }
};
var calculateSum = (hours, rateInputId, oldValue) => {
  const activeProject = getActiveProjectName();
  const cutElement = document.getElementById("edit-rates-input-cut");
  const cut = cutElement.getAttribute(`data-project-${activeProject}-rate-cut`);
  const taxElement = document.getElementById("edit-rates-input-tax");
  const tax = taxElement.getAttribute(`data-project-${activeProject}-rate-tax`);
  const rateElement = document.getElementById(`edit-rates-input-${rateInputId}`);
  const rate = rateElement.getAttribute(`data-project-${activeProject}-rate-${rateInputId}`);
  const cutAsPercentage = Number(cut) / 100;
  const taxAsPercentage = Number(tax) / 100;
  const change = hours - oldValue;
  const income = change * Number(rate) * cutAsPercentage * taxAsPercentage;
  return income;
};
var setProjectCombinedIncome = (income, totalProjectIncome, table) => {
  const incomeProject = document.getElementById("income-project");
  if (incomeProject) {
    const activeProject = getActiveProjectName();
    const total = Math.abs(totalProjectIncome + income);
    incomeProject.textContent = formatAsCurrency(total);
    table.setAttribute(`data-project-${activeProject}-income`, total.toString());
  }
  calculateCombinedIncome(income);
};
var calculateCombinedIncome = (income) => {
  const incomeCombined = document.getElementById("income-combined");
  if (incomeCombined) {
    const currentIncome = removeCurrencyFormat(incomeCombined.textContent);
    const total = Math.abs(currentIncome + income);
    incomeCombined.textContent = formatAsCurrency(total);
  }
};
var formatAsCurrency = (total) => {
  const formatted = new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK"
  }).format(total).toString();
  return formatted;
};
var removeCurrencyFormat = (value) => {
  if (value) {
    value = value.replaceAll(/[kr\s]/g, "").replaceAll(",", ".");
    return Number(value);
  } else {
    return 0;
  }
};
var oberserverConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeOldValue: true
};
var startObserving = (table) => {
  const observer = new MutationObserver(onChangeObserver);
  observer.observe(table, oberserverConfig);
};

// src/calendar.ts
var DayTypeEnum;
(function(DayTypeEnum2) {
  DayTypeEnum2["Weekday"] = "weekday";
  DayTypeEnum2["Saturday"] = "saturday";
  DayTypeEnum2["Sunday"] = "sunday";
  DayTypeEnum2["Inactive"] = "inactive";
})(DayTypeEnum || (DayTypeEnum = {}));
var currentDate = new Date;
var numOfDaysInFebruary = () => {
  const year = new Date().getFullYear();
  if (year % 4 === 0) {
    if (year % 100 === 0 && year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }
};
var dateMapper = [
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
  31
];
var getStartDay = () => {
  const today = new Date;
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth()).getUTCDay();
  return firstDayOfMonth;
};
var getLastDay = () => {
  const today = new Date;
  const month = today.getMonth();
  const numOfDays = dateMapper[month];
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), numOfDays);
  return lastDayOfMonth.getUTCDay();
};
var renderMonth = () => {
  const numOfDays = dateMapper[new Date().getMonth()] || 0;
  const numOfWeeks = Math.ceil(numOfDays / 7);
  const startDayOfMonth = getStartDay();
  const lastDayOfMonth = getLastDay();
  let date = 1;
  const tbody = createElement("tbody", "tbody");
  for (let week = 0;week < numOfWeeks; week++) {
    let row = createElement("tr");
    if (week === 0) {
      for (let dayOfWeek = 0;dayOfWeek < 7; dayOfWeek++) {
        if (dayOfWeek < startDayOfMonth) {
          row.appendChild(renderDay(0, dayOfWeek, "inactive"));
        } else {
          row.appendChild(renderDay(date, dayOfWeek));
          date++;
        }
      }
    } else if (week === numOfWeeks - 1) {
      for (let dayOfWeek = 0;dayOfWeek < 7; dayOfWeek++) {
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
var renderDay = (date, dayOfWeek, type = "active") => {
  const td = createElement("td");
  const input = createElement("input", `date-input-${date}`);
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", date.toString());
  input.setAttribute("data-day-type", DayTypeEnum.Weekday);
  input.addEventListener("keypress", (event) => {
    if (input.readOnly) {
      return;
    }
    const key = event.key.toLocaleLowerCase();
    if (key === "f") {
      event.preventDefault();
      setHoursAndIncome(input, event, "7.5");
    } else if (key === "d") {
      event.preventDefault();
      setHoursAndIncome(input, event, "0");
    }
  });
  input.addEventListener("change", (event) => {
    setHoursAndIncome(input, event);
  });
  const isWeekend = dayOfWeek > 4 && type !== "inactive";
  let className = "calendar-day";
  if (isWeekend) {
    className = "calendar-day-weekend";
    if (dayOfWeek === 5) {
      input.setAttribute("data-day-type", DayTypeEnum.Saturday);
    } else {
      input.setAttribute("data-day-type", DayTypeEnum.Sunday);
    }
  } else if (type === "inactive") {
    className = "calendar-day-inactive";
    input.setAttribute("data-day-type", DayTypeEnum.Inactive);
  }
  input.classList.add(className);
  td.appendChild(input);
  return td;
};
var setHoursAndIncome = (input, event, hours) => {
  const target = event.target;
  if (target) {
    const value = hours ? hours : target.value;
    input.value = value;
    const table = document.getElementById("table");
    const activeProject = table?.getAttribute("data-active-project");
    input.setAttribute(`data-project-${activeProject}-hours`, value);
    input.setAttribute(`data-project-${activeProject}-income`, Math.floor(calculateDayIncome(input)).toString());
  }
};
var renderCalendar = () => {
  const table = createElement("table", "table");
  table.setAttribute("data-active-project", "default");
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
    "Sunday"
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

// src/project.ts
var createProjectButton = (name, projectRow) => {
  const id = name.replaceAll(/\s/g, "-").toLocaleLowerCase();
  const projectButton = createElement("button", `project-${id}`);
  projectButton.textContent = name;
  const table = document.getElementById("table");
  table?.setAttribute(`data-project-${id}-total-hours`, "0");
  table?.setAttribute(`data-project-${id}-income`, "0");
  projectButton.addEventListener("click", () => {
    table?.setAttribute("data-active-project", id);
    projectButton.classList.add("project-button-active");
    projectRow.childNodes.forEach((button) => {
      if (button.nodeName !== "INPUT") {
        let buttonAsElement = button;
        if (buttonAsElement.outerText !== name) {
          buttonAsElement.className = "";
        }
      }
    });
    setRates("weekday");
    setRates("saturday");
    setRates("sunday");
    setRates("cut");
    setRates("tax");
  });
  return projectButton;
};
var setRates = (id) => {
  const activeProject = getActiveProjectName();
  const input = document.getElementById(`edit-rates-input-${id}`);
  if (input) {
    input.setAttribute(`data-project-${activeProject}-rate-${id}`, input.value);
  }
};
var createAddNewProjectButton = (projectRow, viewToggler) => {
  const addNewProjectInput = createElement("input", "addProject");
  addNewProjectInput.setAttribute("placeholder", "Add new project");
  addNewProjectInput.addEventListener("change", (event) => {
    const target = event.target;
    if (target) {
      const projectName = target.value;
      const newProjectButton = createProjectButton(projectName, projectRow);
      addNewProjectInput.value = "";
      projectRow.removeChild(viewToggler);
      projectRow.removeChild(addNewProjectInput);
      projectRow.appendChild(newProjectButton);
      projectRow.appendChild(addNewProjectInput);
      projectRow.appendChild(viewToggler);
    }
  });
  projectRow.appendChild(addNewProjectInput);
  return projectRow;
};
var createProjectRow = () => {
  let projectRow = createElement("div");
  projectRow.className = "project-row";
  const projectButton = createProjectButton("Default", projectRow);
  projectButton.classList.add("project-button-active");
  projectRow.appendChild(projectButton);
  const viewToggler = createViewTogglerButtons();
  projectRow = createAddNewProjectButton(projectRow, viewToggler);
  projectRow.appendChild(viewToggler);
  return projectRow;
};
var createViewTogglerButtons = () => {
  const buttonRow = createElement("div", "button-column");
  const moneyButton = createElement("button", "toggle-view-money");
  const hoursButton = createElement("button", "toggle-view-hours");
  moneyButton.textContent = "$";
  const activeClass = "project-button-active";
  moneyButton.addEventListener("click", () => {
    setMode("income");
    hoursButton.className = "";
    moneyButton.className = activeClass;
  });
  hoursButton.textContent = "H";
  hoursButton.addEventListener("click", () => {
    setMode("hours");
    moneyButton.className = "";
    hoursButton.className = activeClass;
  });
  hoursButton.className = activeClass;
  buttonRow.appendChild(moneyButton);
  buttonRow.appendChild(hoursButton);
  document.addEventListener("keypress", (event) => {
    const key = event.key.toLocaleLowerCase();
    if (key === "h") {
      setMode("hours");
      moneyButton.className = "";
      hoursButton.className = activeClass;
    } else if (key === "m") {
      setMode("income");
      hoursButton.className = "";
      moneyButton.className = activeClass;
    }
  });
  return buttonRow;
};
var setMode = (mode) => {
  const readOnly = mode === "income" ? true : false;
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  if (weeks) {
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            const input = day.firstChild;
            const value = input.getAttribute(`data-project-${getActiveProjectName()}-${mode}`);
            input.readOnly = readOnly;
            if (value) {
              input.value = value.toString();
            } else {
              input.value = "";
            }
          }
        });
      }
    });
  }
};
var createRateInput = (id, label, defaultRate) => {
  const activeProject = getActiveProjectName();
  console.log("activeProject", activeProject);
  const weekdayRates = createElement("input", `edit-rates-input-${id}`);
  weekdayRates.setAttribute(`data-project-${activeProject}-rate-${id}`, defaultRate);
  weekdayRates.value = defaultRate;
  weekdayRates.textContent = defaultRate;
  const weekdayLabel = createElement("label", `edit-rates-label-${id}`);
  weekdayLabel.textContent = label;
  weekdayLabel.appendChild(weekdayRates);
  return weekdayLabel;
};
var createEditRatesDetails = () => {
  const editRatesDetails = createElement("details", "edit-rates");
  const summary = createElement("summary", "edit-rates-summary");
  summary.textContent = "Edit project rates";
  const container = createElement("div", "edit-rates-container");
  editRatesDetails.appendChild(summary);
  container.appendChild(createRateInput("weekday", "Weekday", "1309"));
  container.appendChild(createRateInput("saturday", "Saturday", "1309"));
  container.appendChild(createRateInput("sunday", "Sunday", "1309"));
  container.appendChild(createRateInput("cut", "% cut (45% default)", "45"));
  container.appendChild(createRateInput("tax", "% tax", "42"));
  editRatesDetails.appendChild(container);
  return editRatesDetails;
};

// src/stats.ts
var createStatsDetails = () => {
  const statsDetails = createElement("details", "stats-details");
  const summary = createElement("summary", "stats-summary");
  summary.textContent = "Hours / Income";
  statsDetails.appendChild(summary);
  return statsDetails;
};
var createStatRow = (id, text) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const projectHours = createElement("span", id);
  projectHours.textContent = "0";
  liElement.appendChild(projectHours);
  return liElement;
};
var createStats = () => {
  const details = createStatsDetails();
  const list = createElement("ul");
  const projectHoursListElement = createStatRow("hours-project", "Hours (project): ");
  const combinedHoursListElement = createStatRow("hours-combined", "Hours (combined): ");
  const projectIncomeListElement = createStatRow("income-project", "Income (project): ");
  const combinedIncomeListElement = createStatRow("income-combined", "Income (combined): ");
  list.appendChild(projectHoursListElement);
  list.appendChild(combinedHoursListElement);
  list.appendChild(projectIncomeListElement);
  list.appendChild(combinedIncomeListElement);
  details.appendChild(list);
  return details;
};

// index.ts
var app = document.getElementById("app");
var stats2 = createStats();
var table = renderCalendar();
var editRates = createEditRatesDetails();
if (app) {
  app.appendChild(table);
  const projectRow = createProjectRow();
  app.appendChild(projectRow);
  app.appendChild(stats2);
  app.appendChild(editRates);
  const appObserver = new MutationObserver(() => {
  });
}
startObserving(table);
