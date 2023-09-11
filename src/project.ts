import { createElement, getActiveProjectName } from "./util";

const createProjectButton = (name: string, projectRow: HTMLElement) => {
  const projectButton = createElement("button", `project-${name}`);
  projectButton.textContent = name;
  const table = document.getElementById("table");
  table?.setAttribute(`data-project-${name}-total-hours`, "0");
  projectButton.addEventListener("click", () => {
    table?.setAttribute("data-active-project", name);
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
  });
  return projectButton;
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

export const createEditRatesDetails = () => {
  const editRatesDetails = createElement("details", "edit-rates");
  const summary = createElement("summary", "edit-rates-summary");
  summary.textContent = "Edit project rates";
  const container = createElement("div", "edit-rates-container");
  editRatesDetails.appendChild(summary);

  const weekdayRates = createElement(
    "input",
    "edit-rates-input-weekday"
  ) as HTMLInputElement;
  weekdayRates.value = "1309";
  weekdayRates.textContent = "1309";
  const weekdayLabel = createElement("label", "edit-rates-label-weekday");
  weekdayLabel.textContent = "Weekday rates";
  weekdayLabel.appendChild(weekdayRates);
  container.appendChild(weekdayLabel);

  const saturdayRates = createElement(
    "input",
    "edit-rates-input-saturday"
  ) as HTMLInputElement;
  saturdayRates.value = "1309";
  saturdayRates.textContent = "1309";
  const saturdayLabel = createElement("label", "edit-rates-label-saturday");
  saturdayLabel.textContent = "Saturday rates";
  saturdayLabel.appendChild(saturdayRates);
  container.appendChild(saturdayLabel);

  const sundayRates = createElement(
    "input",
    "edit-rates-input-sunday"
  ) as HTMLInputElement;
  sundayRates.value = "1309";
  sundayRates.textContent = "1309";
  const sundayLabel = createElement("label", "edit-rates-label-sunday");
  sundayLabel.textContent = "Sunday rates";
  sundayLabel.appendChild(sundayRates);
  container.appendChild(sundayLabel);

  const percentAfterCuts = createElement(
    "input",
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  percentAfterCuts.value = "45";
  percentAfterCuts.textContent = "45";
  const percentAfterCutsLabel = createElement("label", "edit-rates-label-cut");
  percentAfterCutsLabel.textContent = "% cut (45% default)";
  percentAfterCutsLabel.appendChild(percentAfterCuts);
  container.appendChild(percentAfterCutsLabel);

  const tax = createElement(
    "input",
    "edit-rates-input-tax"
  ) as HTMLInputElement;
  tax.value = "42";
  tax.textContent = "42";
  const taxLabel = createElement("label", "edit-rates-label-tax");
  taxLabel.textContent = "% tax";
  taxLabel.appendChild(tax);
  container.appendChild(taxLabel);

  editRatesDetails.appendChild(container);

  return editRatesDetails;
};
