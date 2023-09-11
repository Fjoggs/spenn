import { DayType, DayTypeEnum } from "./calendar";
import { getActiveProjectName } from "./util";

enum RecordType {
  AttributeChange = "attributes",
  ChildAddRemove = "childList",
}

const calculateAndSetHours = (
  table: HTMLTableElement,
  inputElement: HTMLInputElement,
  totalProjectHours: number,
  oldValue: number
) => {
  const inputValue = Number(inputElement.value);
  let combinedHours = document.getElementById("hours-combined");
  let newProjectHours = "";
  let newCombinedHours = "";
  if (inputValue === 0) {
    // Value is now empty
    newProjectHours = (totalProjectHours - oldValue).toString();
    newCombinedHours = (
      Number(combinedHours?.textContent) - oldValue
    ).toString();
  } else {
    // Value has changed
    newProjectHours = (totalProjectHours + inputValue).toString();
    newCombinedHours = (
      Number(combinedHours?.textContent) + inputValue
    ).toString();
  }
  let projectHours = document.getElementById("hours-project");
  if (combinedHours && projectHours) {
    combinedHours.textContent = newCombinedHours;
    projectHours.textContent = newProjectHours;
    table.setAttribute(
      `data-project-${getActiveProjectName()}-total-hours`,
      newProjectHours
    );
  }
};

const setActiveProject = (totalProjectHours: number) => {
  const projectHours = document.getElementById("hours-project");
  if (projectHours) {
    projectHours.textContent = totalProjectHours.toString();
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
  const activeProjectName = getActiveProjectName();
  const projectHoursName = `data-project-${activeProjectName}-hours`;
  const totalProjectHours = Number(
    table.getAttribute(`data-project-${activeProjectName}-total-hours`)
  );
  const isCalendarChangeEvent = record.attributeName === projectHoursName;
  const isProjectChangeEvent = record.attributeName === "data-active-project";
  if (isCalendarChangeEvent) {
    const inputElement = record.target as HTMLInputElement;
    const oldValue = Number(record.oldValue);
    calculateAndSetHours(table, inputElement, totalProjectHours, oldValue);
    const income = calculateDayIncome(inputElement, oldValue);
    calculateCombinedIncome(income);
  } else if (isProjectChangeEvent) {
    setActiveProject(totalProjectHours);
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
      return calculateSum(hours, "edit-rates-input-weekday", oldValue);

    case DayTypeEnum.Saturday:
      return calculateSum(hours, "edit-rates-input-saturday", oldValue);

    case DayTypeEnum.Sunday:
      return calculateSum(hours, "edit-rates-input-sunday", oldValue);
    default:
      return 0;
  }
};

const calculateSum = (hours: number, rateInputId: string, oldValue: number) => {
  const cut = document.getElementById(
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  const tax = document.getElementById(
    "edit-rates-input-tax"
  ) as HTMLInputElement;
  const rate = document.getElementById(rateInputId) as HTMLInputElement;
  const cutAsPercentage = Number(cut.value) / 100;
  const taxAsPercentage = Number(tax.value) / 100;
  const isReduction = oldValue > hours;
  if (isReduction) {
    const lostHours = oldValue - hours;
    const reduction = -(
      lostHours *
      Number(rate.value) *
      cutAsPercentage *
      taxAsPercentage
    );
    return reduction;
  } else {
    return hours * Number(rate.value) * cutAsPercentage * taxAsPercentage;
  }
};
const calculateCombinedIncome = (income: number) => {
  let incomeCombined = document.getElementById("income-combined");
  if (incomeCombined) {
    const currentIncome = removeCurrencyFormat(incomeCombined.textContent);
    const total = currentIncome + income;
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
