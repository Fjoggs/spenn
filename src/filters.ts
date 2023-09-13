import { createElement } from "./util";

export type FilterRow = {
  buttonRowId: string;
  filters: Filter[];
};

export type Filter = {
  id: string;
  label: string;
  hotkey: string;
  dataAttribute: Function;
  readOnly: boolean;
  isActive?: boolean;
};

const activeClassName = "project-button-active";

export const createFilterRow = ({ buttonRowId, filters }: FilterRow) => {
  const filterRow = createElement("div", buttonRowId);

  const buttons = filters.map((filter) => {
    const button = createFilterButton(filter, filterRow);
    filterRow.appendChild(button);
    return {
      button,
      hotkey: filter.hotkey,
      dataAttribute: filter.dataAttribute,
      readOnly: filter.readOnly,
    };
  });

  document.addEventListener("keypress", (event) => {
    const key = event.key.toLocaleLowerCase();
    buttons.forEach((button) => {
      if (key === button.hotkey) {
        activateFilter(button.dataAttribute, button.readOnly);
        setOtherFiltersInactive(filterRow);
        button.button.className = activeClassName;
      }
    });
  });
  return filterRow;
};

const createFilterButton = (
  { id, label, dataAttribute, readOnly, isActive }: Filter,
  filterRow: HTMLElement
) => {
  const button = createElement("button", id);
  button.textContent = label;
  if (isActive) {
    button.className = activeClassName;
  }
  button.addEventListener("click", () => {
    activateFilter(dataAttribute, readOnly);
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

const activateFilter = (dataAttribute: Function, readOnly: boolean) => {
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  if (weeks) {
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            console.log("dataAttribute()", dataAttribute());
            const input = day.firstChild as HTMLInputElement;
            const value = input.getAttribute(dataAttribute());
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
