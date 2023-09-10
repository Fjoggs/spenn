import { createElement } from "./util";

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

const createAddProjectButton = (projectRow: HTMLElement) => {
  const addProjectInput = createElement(
    "input",
    "addProject"
  ) as HTMLInputElement;
  addProjectInput.setAttribute("placeholder", "Add new project");
  addProjectInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
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

export const createProjectRow = () => {
  let projectRow = createElement("div");
  projectRow.className = "project-row";
  const projectButton = createProjectButton("Default", projectRow);
  projectButton.classList.add("project-button-active");
  projectRow.appendChild(projectButton);
  projectRow = createAddProjectButton(projectRow);
  return projectRow;
};

export const createEditRatesDetails = () => {
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
