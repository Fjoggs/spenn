import { FilterRow, createFilterRow } from "./filters";
import { createElement, getActiveProjectName } from "./util";

export interface ProjectRow {
  inputId: string;
  inputPlaceholder: string;
}

export const createProjectRow = (filterRow: FilterRow) => {
  let projectRow = createElement("div");
  projectRow.className = "project-row";
  const projectButton = createProjectButton("Default", projectRow);
  projectButton.classList.add("project-button-active");
  projectRow.appendChild(projectButton);
  const filters = createFilterRow(filterRow);
  projectRow = createAddNewProjectButton(
    "Add new project",
    "add-project",
    projectRow,
    filters
  );
  projectRow.appendChild(filters);
  return projectRow;
};

const createAddNewProjectButton = (
  inputId: string,
  inputPlaceholder: string,
  projectRow: HTMLElement,
  viewToggler: HTMLElement
) => {
  const addNewProjectInput = createElement(
    "input",
    inputId
  ) as HTMLInputElement;
  addNewProjectInput.setAttribute("placeholder", inputPlaceholder);
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
