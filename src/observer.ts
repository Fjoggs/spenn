import { DayTypeEnum } from "./calendar";
import { setRates } from "./rate";
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
  const table = document.getElementById("table");
  const activeFilter = table?.getAttribute("data-active-filter") || "hours";
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  setRates();
  if (weeks) {
    weeks.forEach((week) => {
      const days = week.childNodes;
      if (days) {
        days.forEach((day) => {
          if (day.firstChild) {
            const input = day.firstChild as HTMLInputElement;
            const value = input.getAttribute(
              `data-project-${getActiveProjectName()}-${activeFilter}`
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

export const onChangeTableObserver = (records: MutationRecord[]) => {
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
    console.log("calendarChangeEvent");
    const input = record.target as HTMLInputElement;
    const oldValue = Number(record.oldValue);
    setProjectCombinedHours(table, input, totalProjectHours, oldValue);
    const netIncome = calculateDayNetIncome(input, oldValue);
    setProjectCombinedIncome(netIncome, totalProjectIncome, table);
  } else if (isProjectChangeEvent) {
    console.log("isProjectChangeEvent");
    setActiveProject(totalProjectHours, totalProjectIncome);
  } else {
    // console.log("Ignoring event: ", record.attributeName);
  }
};

export const calculateDayNetIncome = (
  inputElement: HTMLInputElement,
  previousHours: number = 0,
  incomingHours?: number
) => {
  const newHours =
    incomingHours ??
    Number(
      inputElement.getAttribute(`data-project-${getActiveProjectName()}-hours`)
    );
  const dayType = inputElement.getAttribute("data-day-type");
  switch (dayType) {
    case DayTypeEnum.Weekday:
      return calculateNetSum(newHours, "weekday", previousHours);

    case DayTypeEnum.Saturday:
      return calculateNetSum(newHours, "saturday", previousHours);

    case DayTypeEnum.Sunday:
      return calculateNetSum(newHours, "sunday", previousHours);
    default:
      return 0;
  }
};

/*
  Cut explanation:
  100% hourly rate:
  40% goes to Noria
  60% goes to consultant (truth with modifications)
  14.1% goes to AGA (Once income passes 750k NOK, you pay 5% more AGA for a total 19.1% but that's not accounted for here)
  12% goes to holiday pay
  2.5% goes to pension (Noria pays 2.5% for a total of 5% pension for each individual)
  
  Forumula = Hourly rate * cut
  */
const calculateNetSum = (hours: number, rateId: string, oldValue: number) => {
  const rateElement = document.getElementById(
    `edit-rates-input-${rateId}`
  ) as HTMLInputElement;
  const rate = rateElement.getAttribute(
    `data-project-${getActiveProjectName()}-rate-${rateId}`
  );
  if (rate) {
    const change = hours - oldValue;
    const gross = calculateGross(change, rate);
    const grossAfterCut = afterCut(gross);
    const grossAfterAga = afterAga(grossAfterCut);
    const grossAfterHolidayPay = afterHolidayPay(grossAfterAga);
    const grossAfterPension = afterPension(grossAfterHolidayPay);
    const net = afterTax(grossAfterPension);
    return net;
  } else {
    return 0;
  }
};

const calculateGross = (hours: number, rate: string) => hours * Number(rate);

const afterCut = (gross: number) => {
  const cutElement = document.getElementById(
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  const cut = Number(cutElement.value) / 100;
  const grossAfterCut = gross * cut;
  return grossAfterCut;
};

const afterAga = (grossAfterCut: number) => {
  const agaElement = document.getElementById(
    "edit-rates-input-aga"
  ) as HTMLInputElement;
  const aga = Number(agaElement.value) / 100 + 1; // An aga of 14.1% makes this 1.141
  // Aga is added on top of pay, so we need to divide by 1.141 (14.1%) to get the original number
  const grossAfterAga = grossAfterCut / aga;
  return grossAfterAga;
};

const afterHolidayPay = (grossAfterAga: number) => {
  const holidayElement = document.getElementById(
    "edit-rates-input-holiday"
  ) as HTMLInputElement;
  const holiday = Number(holidayElement.value) / 100 + 1;
  const grossAfterHolidayPay = grossAfterAga / holiday;
  return grossAfterHolidayPay;
};

const afterPension = (grossAfterHolidayPay: number) => {
  const pensionElement = document.getElementById(
    "edit-rates-input-pension"
  ) as HTMLInputElement;
  const consultantsPartOfPension = Number(pensionElement.value) / 2; // Noria covers half
  const pension = consultantsPartOfPension / 100 + 1;
  const grossAfterPension = grossAfterHolidayPay / pension;
  return grossAfterPension;
};

const afterTax = (gross: number) => {
  const taxElement = document.getElementById(
    "edit-rates-input-tax"
  ) as HTMLInputElement;
  const tax = Number(taxElement.value) / 100;
  return gross * (1 - tax);
};

const setProjectCombinedIncome = (
  income: number,
  totalProjectIncome: number,
  table: HTMLTableElement
) => {
  const incomeProject = document.getElementById("income-project");
  if (incomeProject) {
    const total = Math.abs(totalProjectIncome + income);
    incomeProject.textContent = formatAsCurrency(total);
    table.setAttribute(
      `data-project-${getActiveProjectName()}-income`,
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

export const tableObserver = (table: HTMLTableElement) => {
  const observer = new MutationObserver(onChangeTableObserver);
  observer.observe(table, oberserverConfig);
};

export const rateObserver = (rateContainer: HTMLElement) => {
  const observer = new MutationObserver(onChangeRatesObserver);
  observer.observe(rateContainer, oberserverConfig);
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

const recalculateIncome = () => {
  const activeProject = getActiveProjectName();
  const table = document.getElementById("table");
  const tableBody = document.getElementById("tbody");
  const weeks = tableBody?.childNodes;
  console.log("recalculating");
  if (weeks) {
    // reset total income
    table?.setAttribute(`data-project-${activeProject}-income`, "0");
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
                `data-project-${activeProject}-hours`
              );
              sum = Math.floor(calculateDayNetIncome(input, 0, Number(hours)));
            } else {
              sum = Math.floor(calculateDayNetIncome(input));
            }
            if (sum > 0) {
              input.setAttribute(
                `data-project-${activeProject}-income`,
                sum.toString()
              );
              if (filterMode === "income") {
                input.value = sum.toString();
              }
            } else {
              input.removeAttribute(`data-project-${activeProject}-income`);
            }
          }
        });
      }
    });
  }
};
