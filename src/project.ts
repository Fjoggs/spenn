import { FilterRow, createFilterRow } from "./filters";
import { Rate } from "./rate";
import { CalendarAttributes } from "./state";
import { createElement } from "./util";

export interface ProjectRow {
  defaultProjectName: string;
  inputId: string;
  inputPlaceholder: string;
}

export const createProjectRow = (
  { defaultProjectName, inputId, inputPlaceholder }: ProjectRow,
  filterRow: FilterRow,
  rates: Rate[],
  table: CalendarAttributes
) => {
  let projectRow = createElement("div");
  projectRow.className = "project-row";
  const projectButton = createProjectButton(
    defaultProjectName,
    projectRow,
    rates,
    table
  );
  projectButton.className = "project-button-active";
  projectRow.appendChild(projectButton);
  const filterRowElement = createFilterRow(filterRow);
  projectRow = createAddNewProjectButton(
    inputId,
    inputPlaceholder,
    projectRow,
    filterRowElement,
    rates,
    table
  );
  projectRow.appendChild(filterRowElement);
  return projectRow;
};

const createAddNewProjectButton = (
  inputId: string,
  inputPlaceholder: string,
  projectRow: HTMLElement,
  filterRow: HTMLElement,
  rates: Rate[],
  table: CalendarAttributes
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
      const newProjectButton = createProjectButton(
        projectName,
        projectRow,
        rates,
        table
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

const createProjectButton = (
  name: string,
  projectRow: HTMLElement,
  rates: Rate[],
  table: CalendarAttributes
) => {
  const id = removeWhiteSpace(name);
  const button = createElement("button", `project-${id}`);
  button.textContent = name;
  const tableElement = document.getElementById("table");
  table.dataAttributes.forEach((dataAttribute) => {
    tableElement?.setAttribute(dataAttribute(id), "0");
  });
  button.addEventListener("click", () =>
    onClickProjectButton(tableElement, id, button, projectRow, name, rates)
  );
  return button;
};

const onClickProjectButton = (
  table: HTMLElement | null,
  id: string,
  button: HTMLElement,
  projectRow: HTMLElement,
  name: string,
  rates: Rate[]
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
    setRates(rate.id, rate.dataAttribute);
  });
};

const setRates = (inputId: string, dataAttribute: Function) => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (input) {
    const dataAttributeValue = input.getAttribute(dataAttribute());
    if (dataAttributeValue) {
      input.setAttribute(dataAttribute(), dataAttributeValue);
    } else {
      // Data value has not been set (new project?). Carry over value from other project
      input.setAttribute(dataAttribute(), input.value);
    }
  }
};

const removeWhiteSpace = (name: string) =>
  name.replaceAll(/\s/g, "-").toLocaleLowerCase();
