// src/util.ts
var createElement = (tagName, id) => {
  const element = document.createElement(tagName);
  if (id) {
    element.setAttribute("id", id);
  }
  return element;
};

// src/calendar.ts
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
  input.setAttribute("data-day-type", "weekday");
  input.addEventListener("change", (event) => {
    const target = event.target;
    if (target) {
      input.value = target.value;
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
var renderCalendar = () => {
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

// src/observer.ts
var getActiveProjectName = () => document.getElementById("table")?.getAttribute("data-active-project")?.toLocaleLowerCase();
var ChangeEvent;
(function(ChangeEvent2) {
  ChangeEvent2["AttributeChange"] = "attributes";
  ChangeEvent2["ChildAddRemove"] = "childList";
})(ChangeEvent || (ChangeEvent = {}));
var calculateProjectHours = (table, inputElement, totalProjectHours, oldValue) => {
  const inputValue = Number(inputElement.value);
  let combinedHours = document.getElementById("hours-combined");
  let newProjectHours = "";
  let newCombinedHours = "";
  if (inputValue === 0) {
    newProjectHours = (totalProjectHours - oldValue).toString();
    newCombinedHours = (Number(combinedHours?.textContent) - oldValue).toString();
  } else {
    newProjectHours = (totalProjectHours + inputValue).toString();
    newCombinedHours = (Number(combinedHours?.textContent) + inputValue).toString();
  }
  let projectHours = document.getElementById("hours-project");
  if (combinedHours && projectHours) {
    combinedHours.textContent = newCombinedHours;
    projectHours.textContent = newProjectHours;
    table.setAttribute(`data-project-${getActiveProjectName()}-total-hours`, newProjectHours);
  }
};
var onChangeObserver = (records, observer) => {
  const table = document.getElementById("table");
  if (table) {
    const activeProjectName = getActiveProjectName();
    console.log("activeProjectName", activeProjectName);
    const totalProjectHours = Number(table.getAttribute(`data-project-${activeProjectName}-total-hours`));
    for (const record of records) {
      if (record.type === ChangeEvent.ChildAddRemove) {
      } else if (record.type === ChangeEvent.AttributeChange) {
        const projectHours = document.getElementById("hours-project");
        if (record.attributeName === `data-project-${activeProjectName}-value`) {
          const inputElement = record.target;
          calculateProjectHours(table, inputElement, totalProjectHours, Number(record.oldValue));
        }
        if (record.attributeName === "data-active-project") {
          if (projectHours) {
            projectHours.textContent = totalProjectHours.toString();
          }
          const tableBody = document.getElementById("tbody");
          const trElements = tableBody?.childNodes;
          if (trElements) {
            trElements.forEach((tr) => {
              const tdElements = tr.childNodes;
              if (tdElements) {
                tdElements.forEach((td) => {
                  if (td.firstChild) {
                    const input = td.firstChild;
                    const value = input.getAttribute(`data-project-${activeProjectName}-value`);
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
        }
      }
    }
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

// src/project.ts
var createProjectButton = (name, projectRow) => {
  const projectButton = createElement("button", `project-${name}`);
  projectButton.textContent = name;
  const table = document.getElementById("table");
  table?.setAttribute(`data-project-${name}-total-hours`, "0");
  projectButton.addEventListener("click", () => {
    table?.setAttribute("data-active-project", name);
    projectButton.classList.add("project-button-active");
    projectRow.childNodes.forEach((button) => {
      if (button.nodeName !== "INPUT") {
        let buttonAsElement = button;
        if (buttonAsElement.outerText !== name) {
          buttonAsElement.className = "";
        }
      }
    });
  });
  return projectButton;
};
var createAddProjectButton = (projectRow) => {
  const addProjectInput = createElement("input", "addProject");
  addProjectInput.setAttribute("placeholder", "Add new project");
  addProjectInput.addEventListener("change", (event) => {
    const target = event.target;
    if (target) {
      const projectName = target.value;
      const newProjectButton = createProjectButton(projectName, projectRow);
      addProjectInput.value = "";
      projectRow.removeChild(addProjectInput);
      projectRow.appendChild(newProjectButton);
      projectRow.appendChild(addProjectInput);
    }
  });
  projectRow.appendChild(addProjectInput);
  return projectRow;
};
var createProjectRow = () => {
  let projectRow = createElement("div");
  projectRow.className = "project-row";
  const projectButton = createProjectButton("Default", projectRow);
  projectButton.classList.add("project-button-active");
  projectRow.appendChild(projectButton);
  projectRow = createAddProjectButton(projectRow);
  return projectRow;
};
var createEditRatesDetails = () => {
  const editRates = createElement("details", "edit-rates");
  const summary = createElement("summary", "edit-rates-summary");
  summary.textContent = "Edit project rates";
  const container = createElement("div", "edit-rates-container");
  editRates.appendChild(summary);
  const weekdayRates = createElement("input", "edit-rates-input-weekday");
  const weekdayLabel = createElement("label", "edit-rates-label-weekday");
  weekdayLabel.textContent = "Weekday rates";
  weekdayLabel.appendChild(weekdayRates);
  container.appendChild(weekdayLabel);
  const saturdayRates = createElement("input", "edit-rates-input-saturday");
  const saturdayLabel = createElement("label", "edit-rates-label-saturday");
  saturdayLabel.textContent = "Saturday rates";
  saturdayLabel.appendChild(saturdayRates);
  container.appendChild(saturdayLabel);
  const sundayRates = createElement("input", "edit-rates-input-sunday");
  const sundayLabel = createElement("label", "edit-rates-label-sunday");
  sundayLabel.textContent = "Sunday rates";
  sundayLabel.appendChild(sundayRates);
  container.appendChild(sundayLabel);
  editRates.appendChild(container);
  return editRates;
};

// src/stats.ts
var createStatRow = (id, text) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const projectHours = createElement("span", id);
  projectHours.textContent = "0";
  liElement.appendChild(projectHours);
  return liElement;
};
var createStats = () => {
  const list = createElement("ul");
  const projectHoursListElement = createStatRow("hours-project", "Hours (project): ");
  const combinedHoursListElement = createStatRow("hours-combined", "Hours (combined): ");
  const projectIncomeListElement = createStatRow("income-project", "Income (project): ");
  const combinedIncomeListElement = createStatRow("income-combined", "Income (combined): ");
  list.appendChild(projectHoursListElement);
  list.appendChild(combinedHoursListElement);
  list.appendChild(projectIncomeListElement);
  list.appendChild(combinedIncomeListElement);
  return list;
};

// index.ts
var app = document.getElementById("app");
var stats2 = createStats();
var table = renderCalendar();
var editRates = createEditRatesDetails();
if (app) {
  app.appendChild(table);
  const projectRow = createProjectRow();
  app.appendChild(stats2);
  app.appendChild(projectRow);
  app.appendChild(editRates);
  const appObserver = new MutationObserver(() => {
  });
}
startObserving(table);
