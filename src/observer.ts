import { DayType, DayTypeEnum } from "./calendar";
import { getActiveProjectName } from "./util";

enum RecordType {
  AttributeChange = "attributes",
  ChildAddRemove = "childList",
}

const setProjectCombinedHours = (
  table: HTMLTableElement,
  inputElement: HTMLInputElement,
  totalProjectHours: number,
  oldValue: number
) => {
  const hours = Number(inputElement.value);
  const projectHours = document.getElementById("hours-project");
  const combinedHours = document.getElementById("hours-combined");
  let newProjectHours = "";
  let newCombinedHours = "";
  const change = hours - oldValue;
  newProjectHours = (totalProjectHours + change).toString();
  newCombinedHours = (Number(combinedHours?.textContent) + change).toString();
  if (combinedHours && projectHours) {
    combinedHours.textContent = newCombinedHours;
    projectHours.textContent = newProjectHours;
    table.setAttribute(
      `data-project-${getActiveProjectName()}-total-hours`,
      newProjectHours
    );
  }
};

const setActiveProject = (
  totalProjectHours: number,
  totalProjectIncome: number
) => {
  const projectHours = document.getElementById("hours-project");
  const projectIncome = document.getElementById("income-project");
  if (projectHours && projectIncome) {
    projectHours.textContent = totalProjectHours.toString();
    projectIncome.textContent = formatAsCurrency(totalProjectIncome);
  }
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
              `data-project-${getActiveProjectName()}-hours`
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
};

export const onChangeObserver = (records: MutationRecord[]) => {
  const table = document.getElementById("table") as HTMLTableElement;
  if (table) {
    for (const record of records) {
      switch (record.type) {
        case RecordType.ChildAddRemove:
          break;
        case RecordType.AttributeChange:
          handleAttributeChange(table, record);
          break;
        default:
          break;
      }
    }
  }
};

const handleAttributeChange = (
  table: HTMLTableElement,
  record: MutationRecord
) => {
  const activeProject = getActiveProjectName();
  const projectHoursName = `data-project-${activeProject}-hours`;
  const totalProjectHours = Number(
    table.getAttribute(`data-project-${activeProject}-total-hours`)
  );
  const totalProjectIncome = Number(
    table.getAttribute(`data-project-${activeProject}-income`)
  );
  const isCalendarChangeEvent = record.attributeName === projectHoursName;
  const isProjectChangeEvent = record.attributeName === "data-active-project";
  if (isCalendarChangeEvent) {
    const inputElement = record.target as HTMLInputElement;
    const oldValue = Number(record.oldValue);
    setProjectCombinedHours(table, inputElement, totalProjectHours, oldValue);
    const income = calculateDayIncome(inputElement, oldValue);
    setProjectCombinedIncome(income, totalProjectIncome, table);
  } else if (isProjectChangeEvent) {
    setActiveProject(totalProjectHours, totalProjectIncome);
  }
};

export const calculateDayIncome = (
  inputElement: HTMLInputElement,
  oldValue: number = 0
) => {
  const hours = Number(inputElement.value);
  const dayType = inputElement.getAttribute("data-day-type");

  switch (dayType) {
    case DayTypeEnum.Weekday:
      return calculateSum(hours, "weekday", oldValue);

    case DayTypeEnum.Saturday:
      return calculateSum(hours, "saturday", oldValue);

    case DayTypeEnum.Sunday:
      return calculateSum(hours, "sunday", oldValue);
    default:
      return 0;
  }
};

const calculateSum = (hours: number, rateInputId: string, oldValue: number) => {
  const activeProject = getActiveProjectName();
  const cutElement = document.getElementById(
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  const cut = cutElement.getAttribute(`data-project-${activeProject}-rate-cut`);
  const taxElement = document.getElementById(
    "edit-rates-input-tax"
  ) as HTMLInputElement;
  const tax = taxElement.getAttribute(`data-project-${activeProject}-rate-tax`);
  const rateElement = document.getElementById(
    `edit-rates-input-${rateInputId}`
  ) as HTMLInputElement;
  const rate = rateElement.getAttribute(
    `data-project-${activeProject}-rate-${rateInputId}`
  );
  const cutAsPercentage = Number(cut) / 100;
  const taxAsPercentage = Number(tax) / 100;
  const change = hours - oldValue;
  const income = change * Number(rate) * cutAsPercentage * taxAsPercentage;
  return income;
};

const setProjectCombinedIncome = (
  income: number,
  totalProjectIncome: number,
  table: HTMLTableElement
) => {
  const incomeProject = document.getElementById("income-project");
  if (incomeProject) {
    const activeProject = getActiveProjectName();
    const total = Math.abs(totalProjectIncome + income);
    incomeProject.textContent = formatAsCurrency(total);
    table.setAttribute(
      `data-project-${activeProject}-income`,
      total.toString()
    );
  }
  calculateCombinedIncome(income);
};

const calculateCombinedIncome = (income: number) => {
  const incomeCombined = document.getElementById("income-combined");
  if (incomeCombined) {
    const currentIncome = removeCurrencyFormat(incomeCombined.textContent);
    const total = Math.abs(currentIncome + income);
    incomeCombined.textContent = formatAsCurrency(total);
  }
};

const formatAsCurrency = (total: number) => {
  const formatted = new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
  })
    .format(total)
    .toString();
  return formatted;
};

const removeCurrencyFormat = (value: string | null) => {
  if (value) {
    value = value.replaceAll(/[kr\s]/g, "").replaceAll(",", "."); // Remove kr and whitespace + replace , with .
    return Number(value);
  } else {
    return 0;
  }
};

const oberserverConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
};

export const startObserving = (table: HTMLTableElement) => {
  const observer = new MutationObserver(onChangeObserver);
  observer.observe(table, oberserverConfig);
};
