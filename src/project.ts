import { MonthState } from "./state";
import { FilterRow, createFilterRow } from "./filters";
import { formatAsCurrency } from "./observer";
import { Rate } from "./rate";
import { ProjectState } from "./state";
import { createElement } from "./util";
import { CalendarAttributes } from "./guiState";

export interface ProjectRow {
  inputId: string;
  inputPlaceholder: string;
}

export const createProjectRow = (
  { inputId, inputPlaceholder }: ProjectRow,
  filterRow: FilterRow,
  rates: Rate[],
  calendarAttributes: CalendarAttributes,
  projects?: ProjectState[],
) => {
  let projectRow = createElement("div", "project-row");
  projectRow.className = "project-row";
  if (!projects) {
    projects = [
      {
        name: "Default",
      },
    ];
  }
  projects.forEach((project, index) => {
    const projectButton = createNewProject(
      project.name,
      projectRow,
      rates,
      calendarAttributes,
    );
    if (index === 0) {
      const table = document.getElementById("table");
      table?.setAttribute("data-active-project", project.name);
      projectButton.className = "project-button-active";
    }
    projectRow.appendChild(projectButton);
  });
  const filterRowElement = createFilterRow(filterRow);
  projectRow = createAddNewProjectInput(
    inputId,
    inputPlaceholder,
    projectRow,
    filterRowElement,
    rates,
    calendarAttributes,
  );
  projectRow.appendChild(filterRowElement);
  return projectRow;
};

const createAddNewProjectInput = (
  inputId: string,
  inputPlaceholder: string,
  projectRow: HTMLElement,
  filterRow: HTMLElement,
  rates: Rate[],
  calendarAttributes: CalendarAttributes,
) => {
  const addNewProjectInput = createElement(
    "input",
    inputId,
  ) as HTMLInputElement;
  addNewProjectInput.setAttribute("placeholder", inputPlaceholder);
  addNewProjectInput.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      const projectName = target.value;
      const newProjectButton = createNewProject(
        projectName,
        projectRow,
        rates,
        calendarAttributes,
      );
      addNewProjectInput.value = "";
      projectRow.removeChild(filterRow);
      projectRow.removeChild(addNewProjectInput);
      projectRow.appendChild(newProjectButton);
      projectRow.appendChild(addNewProjectInput);
      projectRow.appendChild(filterRow);
    }
  });
  projectRow.appendChild(addNewProjectInput);
  return projectRow;
};

const createNewProject = (
  name: string,
  projectRow: HTMLElement,
  rates: Rate[],
  calendarAttributes: CalendarAttributes,
) => {
  const id = removeWhiteSpaceAndComma(name);
  const button = createElement("button", `project-${id}`);
  const table = document.getElementById("table");
  if (projectNameExists(id, table)) {
    throw Error("Project name already exists");
  } else {
    button.textContent = name;
    const projectsArray = getProjectsArray();
    if (projectsArray) {
      projectsArray?.push(id);
      table?.setAttribute(
        "data-projects",
        projectsArray?.join(",") || "Default,",
      );
    } else {
      table?.setAttribute("data-projects", id);
    }
    calendarAttributes.dataAttributes.forEach((dataAttribute) => {
      table?.setAttribute(dataAttribute.replace("PROJECT_NAME", id), "0");
    });
    button.addEventListener("click", () =>
      onClickProjectButton(table, id, button, projectRow, name, rates),
    );
    return button;
  }
};

export const getProjectsArray = () => {
  const table = document.getElementById("table");
  const projectsAttribute = table?.getAttribute("data-projects");
  if (projectsAttribute) {
    return projectsAttribute?.split(",");
  }
  return [];
};

const projectNameExists = (name: string, table: HTMLElement | null) => {
  const projects = table?.getAttribute("data-projects");
  if (projects?.indexOf(name) !== -1) {
    return true;
  } else {
    return false;
  }
};

const onClickProjectButton = (
  table: HTMLElement | null,
  id: string,
  button: HTMLElement,
  projectRow: HTMLElement,
  name: string,
  rates: Rate[],
) => {
  table?.setAttribute("data-active-project", id);
  button.classList.add("project-button-active");
  projectRow.childNodes.forEach((projectButton) => {
    if (projectButton.nodeName !== "INPUT") {
      let buttonAsElement = projectButton as HTMLButtonElement;
      if (buttonAsElement.outerText !== name) {
        // Dont reset itself
        buttonAsElement.className = "";
      }
    }
  });
  rates.forEach((rate) => {
    setRates(
      rate.id,
      rate.dataAttribute.replace("PROJECT_NAME", getActiveProjectName()),
    );
  });
  setProjectValues();
};

const setRates = (inputId: string, dataAttribute: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (input) {
    const dataAttributeValue = input.getAttribute(dataAttribute);
    if (dataAttributeValue) {
      input.setAttribute(dataAttribute, dataAttributeValue);
      input.value = dataAttributeValue;
    } else {
      // Data value has not been set (new project?). Carry over value from other project
      input.setAttribute(dataAttribute, input.value);
    }
  }
};

const removeWhiteSpaceAndComma = (name: string) =>
  name.replaceAll(/\s/g, "-").replaceAll(",", "").toLocaleLowerCase();

export const setProjectValues = () => {
  const activeProject = getActiveProjectName();
  const table = document.getElementById("table");
  if (table) {
    const totalProjectHours = Number(
      table.getAttribute(`data-project-${activeProject}-total-hours`),
    );
    const totalProjectIncome = Number(
      table.getAttribute(`data-project-${activeProject}-total-income`),
    );
    const projectHours = document.getElementById("hours-project");
    const projectIncome = document.getElementById("income-project");
    if (projectHours && projectIncome) {
      projectHours.textContent = totalProjectHours.toString();
      projectIncome.textContent = formatAsCurrency(totalProjectIncome);
    }
    const activeFilter = table?.getAttribute("data-active-filter") || "hours";
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
                `data-project-${getActiveProjectName()}-${activeFilter}`,
              );
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
};

export const setHours = (projects?: ProjectState[]) => {
  // Loop through projects and set all hour attributes
  let total = 0;
  if (projects) {
    projects.forEach((project) => {
      if (project.yearStates) {
        project.yearStates.forEach((yearState) => {
          const today = new Date();
          const currentYear = today.getFullYear();
          if (yearState.year === currentYear && yearState.monthStates) {
            yearState.monthStates.forEach((monthState) => {
              total += setHoursForProject(monthState, project.name);
            });
          }
        });
      }
    });
  }

  const combined = document.getElementById("hours-combined");
  if (combined) {
    combined.textContent = total.toString();
  }
};

const setHoursForProject = (monthState: MonthState, projectName: string) => {
  let total = 0;
  monthState.hours.forEach((hour, index) => {
    const input = document.getElementById(`date-input-${index + 1}`);
    if (input) {
      input.setAttribute(`data-project-${projectName}-hours`, hour);
      total += Number(hour);
    }
  });
  const table = document.getElementById("table");
  if (table) {
    table.setAttribute(
      `data-project-${projectName}-total-hours`,
      total.toString(),
    );
    if (projectName === getActiveProjectName()) {
      const projectHours = document.getElementById("hours-project");
      if (projectHours) {
        projectHours.textContent = total.toString();
      }
    }
  }
  return total;
};

export const getActiveProjectName = () =>
  document
    .getElementById("table")
    ?.getAttribute("data-active-project")
    ?.toLocaleLowerCase() || "default";
