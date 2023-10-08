import { DayTypeEnum } from "./calendar";
import { getActiveProjectName } from "./project";

export const calculateDayIncome = (
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
  
  Formula:
  Gross = hours * hourly rate
  After noria cut = gross * 60%
  Remove aga = afterCut / 1.141
  Remove holiday pay = afterAga / 1.12
  Remove pension = afterHoliday / 1.025
  net = afterPension * (1 - 42%)
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
    const gross = change * Number(rate);
    const afterNoriaCut = afterCut(gross);
    const grossAfterAga = afterAga(afterNoriaCut);
    const grossAfterHolidayPay = afterHolidayPay(grossAfterAga);
    const grossAfterPension = afterPension(grossAfterHolidayPay);
    const net = afterTax(grossAfterPension);
    return net;
  } else {
    return 0;
  }
};

const afterCut = (gross: number) => {
  const cutElement = document.getElementById(
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  const cut = Number(cutElement.value) / 100;
  const grossAfterCut = gross * cut;
  return grossAfterCut;
};

const afterAga = (grossAfterCut: number) =>
  removePercentage("aga", grossAfterCut);

const afterHolidayPay = (grossAfterAga: number) =>
  removePercentage("holiday", grossAfterAga);

const removePercentage = (inputId: string, value: number) => {
  const element = document.getElementById(
    `edit-rates-input-${inputId}`
  ) as HTMLInputElement;
  const removePercentage = Number(element.value) / 100 + 1;
  return value / removePercentage;
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
