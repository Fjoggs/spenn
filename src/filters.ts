import { getActiveProjectName } from "./project";
import { createElement } from "./util";

export type FilterRow = {
  filterRowId: string;
  filters: Filter[];
};

export type Filter = {
  id: string;
  label: string;
  hotkey: string;
  dataAttribute: string;
  filterMode: string;
  readOnly: boolean;
  isActive?: boolean;
};

const activeClassName = "project-button-active";

export const createFilterRow = ({ filterRowId, filters }: FilterRow) => {
  const filterRow = createElement("div", filterRowId);

  const buttons = filters.map((filter) => {
    const button = createFilterButton(filter, filterRow);
    filterRow.appendChild(button);
    return {
      button,
      hotkey: filter.hotkey,
      dataAttribute: filter.dataAttribute,
      filterMode: filter.filterMode,
      readOnly: filter.readOnly,
    };
  });

  document.addEventListener("keypress", (event) => {
    const key = event.key.toLocaleLowerCase();
    buttons.forEach((button) => {
      if (key === button.hotkey) {
        activateFilter(
          button.dataAttribute,
          button.readOnly,
          button.filterMode
        );
        setOtherFiltersInactive(filterRow);
        button.button.className = activeClassName;
      }
    });
  });
  return filterRow;
};

const createFilterButton = (
  { id, label, dataAttribute, readOnly, filterMode, isActive }: Filter,
  filterRow: HTMLElement
) => {
  const button = createElement("button", id);
  button.textContent = label;
  if (isActive) {
    button.className = activeClassName;
  }
  button.addEventListener("click", () => {
    activateFilter(dataAttribute, readOnly, filterMode);
    setOtherFiltersInactive(filterRow);
    button.className = activeClassName;
  });
  return button;
};

const setOtherFiltersInactive = (buttonRow: HTMLElement) => {
  buttonRow.childNodes.forEach((child) => {
    const element = child as HTMLElement;
    element.className = "";
  });
};

const activateFilter = (
  dataAttribute: string,
  readOnly: boolean,
  filterMode: string
) => {
  const table = document.getElementById("table");
  table?.setAttribute("data-active-filter", filterMode);
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
              dataAttribute.replace("PROJECT_NAME", getActiveProjectName())
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
