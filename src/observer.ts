import { calculateDayIncome } from "./calculations";
import { getActiveProjectName } from "./project";
import { renderApp } from "./render";
import { returnCalendarState } from "./state";

export const RecordType = {
  AttributeChange: "attributes",
  ChildAddRemove: "childList",
};

const oberserverConfig: MutationObserverInit = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
};

export const appObserver = (appContainer: HTMLDivElement) => {
  const observer = new MutationObserver(checkForUpdates);
  observer.observe(appContainer, {
    attributes: true,
    childList: false,
    subtree: true,
    attributeOldValue: true,
  });
  return observer;
};

export const tableObserver = (table: HTMLTableElement) => {
  const observer = new MutationObserver(onChangeTableObserver);
  observer.observe(table, oberserverConfig);
  return observer;
};

export const rateObserver = (rateContainer: HTMLElement) => {
  const observer = new MutationObserver(onChangeRatesObserver);
  observer.observe(rateContainer, oberserverConfig);
  return observer;
};

const isTotalChange = (attributeName: string | null) => {
  if (attributeName === `data-project-${getActiveProjectName()}-total-income`) {
    return true;
  } else if (
    attributeName === `data-project-${getActiveProjectName()}-total-hours`
  ) {
    return true;
  }
  return false;
};

const checkForUpdates = (records: MutationRecord[]) => {
  {
    let updateState = false;
    for (const record of records) {
      if (record.type === RecordType.AttributeChange) {
        if (isTotalChange(record.attributeName)) {
          // We dont store this field in state
          continue;
        } else if (
          record.attributeName === "data-year" ||
          record.attributeName === "data-month"
        ) {
          const calendar = document.getElementById("table");
          console.log("record", record);

          const today = new Date();
          const year =
            calendar?.getAttribute("data-year") || today.getFullYear();
          const month =
            calendar?.getAttribute("data-month") || today.getMonth();

          const header = document.getElementById("header") as HTMLDivElement;
          const appContainer = document.getElementById("app") as HTMLDivElement;
          const date = new Date(Number(year), Number(month));
          header.replaceChildren();
          appContainer.replaceChildren();

          renderApp(date, header, appContainer, false);
          break; // No need to handle the month change event
        } else {
          updateState = true;
          break;
        }
      }
    }

    if (updateState) {
      const currentState = returnCalendarState();
      const body = {
        user: "fjogen",
        state: currentState,
      };
      fetch("/api/post", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }
  }
};

const onChangeTableObserver = (records: MutationRecord[]) => {
  const table = document.getElementById("table") as HTMLTableElement;
  if (table) {
    for (const record of records) {
      switch (record.type) {
        case RecordType.ChildAddRemove:
          break;
        case RecordType.AttributeChange:
          const activeProject = getActiveProjectName();
          const projectHoursName = `data-project-${activeProject}-hours`;
          const isCalendarChangeEvent =
            record.attributeName === projectHoursName;
          if (isCalendarChangeEvent) {
            handleTableAttributeChange(table, record);
          }
          break;
        default:
          break;
      }
    }
  }
};

const onChangeRatesObserver = (records: MutationRecord[]) => {
  const rateContainer = document.getElementById("table") as HTMLTableElement;
  if (rateContainer) {
    for (const record of records) {
      switch (record.type) {
        case RecordType.AttributeChange:
          const element = record.target as HTMLElement;
          if (element.id !== "edit-rates-details") {
            recalculateIncome();
          }
          break;
        default:
          break;
      }
    }
  }
};

const handleTableAttributeChange = (
  table: HTMLTableElement,
  record: MutationRecord,
) => {
  const activeProject = getActiveProjectName();

  const input = record.target as HTMLInputElement;
  const totalProjectHours = Number(
    table.getAttribute(`data-project-${activeProject}-total-hours`),
  );
  const totalProjectIncome = Number(
    table.getAttribute(`data-project-${activeProject}-total-income`),
  );
  const oldValue = Number(record.oldValue);
  setProjectHours(table, input, totalProjectHours, oldValue);
  setCombinedHours();
  const netIncome = calculateDayIncome(input, oldValue);
  setProjectIncome(netIncome, totalProjectIncome, table);
  calculateCombinedIncome();
};

const setProjectHours = (
  table: HTMLTableElement,
  inputElement: HTMLInputElement,
  totalProjectHours: number,
  oldValue: number,
) => {
  const hours = Number(inputElement.value);
  const projectHours = document.getElementById("hours-project");
  const change = hours - oldValue;
  const newProjectHours = (totalProjectHours + change).toString();
  if (projectHours) {
    projectHours.textContent = newProjectHours;
    table.setAttribute(
      `data-project-${getActiveProjectName()}-total-hours`,
      newProjectHours,
    );
  }
};

const setProjectIncome = (
  income: number,
  totalProjectIncome: number,
  table: HTMLTableElement,
) => {
  const incomeProject = document.getElementById("income-project");
  if (incomeProject) {
    const total = Math.abs(totalProjectIncome + income);
    incomeProject.textContent = formatAsCurrency(total);
    table.setAttribute(
      `data-project-${getActiveProjectName()}-total-income`,
      total.toString(),
    );
  }
};

export const formatAsCurrency = (total: number) => {
  const formatted = new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
  })
    .format(total)
    .toString();
  return formatted;
};

const setCombinedHours = () => {
  const combinedHoursElement = document.getElementById("hours-combined");
  if (combinedHoursElement) {
    combinedHoursElement.textContent =
      calculateCombinedValue("-total-hours").toString();
  }
};

const calculateCombinedIncome = () => {
  const element = document.getElementById("income-combined");
  if (element) {
    const combined = calculateCombinedValue("-total-income");
    element.textContent = formatAsCurrency(combined);
  }
};

const calculateCombinedValue = (attributeName: string) => {
  const table = document.getElementById("table") as HTMLTableElement;
  const attributes = table.getAttributeNames();
  let combined = 0;
  attributes.forEach((attribute) => {
    if (attribute.includes(attributeName)) {
      const value = table.getAttribute(attribute);
      if (value) {
        combined += Number(value);
      }
    }
  });
  return combined;
};

export const recalculateIncome = () => {
  const activeProject = getActiveProjectName();
  const table = document.getElementById("table") as HTMLTableElement;
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  const projectIncome = document.getElementById("income-project");

  if (projectIncome) {
    // Reset incomes
    table.setAttribute(`data-project-${activeProject}-total-income`, "0");
    projectIncome.textContent = "";
  }
  if (weeks) {
    const filterMode = table?.getAttribute("data-active-filter");
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            const input = day.firstChild as HTMLInputElement;
            let sum = 0;
            if (filterMode === "income") {
              const hours = input.getAttribute(
                `data-project-${activeProject}-hours`,
              );
              sum = calculateDayIncome(input, 0, Number(hours));
            } else {
              sum = calculateDayIncome(input);
            }
            if (sum > 0) {
              input.setAttribute(
                `data-project-${activeProject}-income`,
                Math.floor(sum).toString(),
              );
              if (filterMode === "income") {
                input.value = Math.floor(sum).toString();
              }
            } else {
              input.removeAttribute(`data-project-${activeProject}-income`);
            }
            const totalProjectIncome = Number(
              table.getAttribute(`data-project-${activeProject}-total-income`),
            );
            setProjectIncome(sum, totalProjectIncome, table);
          }
        });
      }
    });
  }
  // Recalculate combined income
  calculateCombinedIncome();
};
