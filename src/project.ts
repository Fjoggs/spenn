import { createElement, getActiveProjectName } from "./util";

const createProjectButton = (name: string, projectRow: HTMLElement) => {
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
        let buttonAsElement = button as HTMLButtonElement;
        if (buttonAsElement.outerText !== name) {
          // Dont reset itself
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

const setRates = (id: string) => {
  const activeProject = getActiveProjectName();
  const input = document.getElementById(
    `edit-rates-input-${id}`
  ) as HTMLInputElement;
  if (input) {
    input.setAttribute(`data-project-${activeProject}-rate-${id}`, input.value);
  }
};

const createAddNewProjectButton = (
  projectRow: HTMLElement,
  viewToggler: HTMLElement
) => {
  const addNewProjectInput = createElement(
    "input",
    "addProject"
  ) as HTMLInputElement;
  addNewProjectInput.setAttribute("placeholder", "Add new project");
  addNewProjectInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
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

export const createProjectRow = () => {
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

export const createViewTogglerButtons = () => {
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

const setMode = (mode: "income" | "hours") => {
  const readOnly = mode === "income" ? true : false;
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  if (weeks) {
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            const input = day.firstChild as HTMLInputElement;
            const value = input.getAttribute(
              `data-project-${getActiveProjectName()}-${mode}`
            );
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

const createRateInput = (id: string, label: string, defaultRate: string) => {
  const activeProject = getActiveProjectName();
  console.log("activeProject", activeProject);
  const weekdayRates = createElement(
    "input",
    `edit-rates-input-${id}`
  ) as HTMLInputElement;
  weekdayRates.setAttribute(
    `data-project-${activeProject}-rate-${id}`,
    defaultRate
  );
  weekdayRates.value = defaultRate;
  weekdayRates.textContent = defaultRate;
  const weekdayLabel = createElement("label", `edit-rates-label-${id}`);
  weekdayLabel.textContent = label;
  weekdayLabel.appendChild(weekdayRates);
  return weekdayLabel;
};

export const createEditRatesDetails = () => {
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
