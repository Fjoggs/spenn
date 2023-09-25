import {
  DetailsElement,
  createDetailsElement,
  createElement,
  getActiveProjectName,
} from "./util";

export type RateDetails = {
  details: DetailsElement;
  containerId: string;
  rateInputs: Rate[];
};

export type Rate = {
  id: string;
  label: string;
  labelId: string;
  defaultRate: string;
  dataAttribute: Function;
};

export const createEditRatesDetails = (rate: RateDetails) => {
  const editRatesDetails = createDetailsElement(rate.details);
  const container = createElement("div", rate.containerId);
  rate.rateInputs.forEach((rateInput) => {
    container.appendChild(createRateInput(rateInput));
  });
  editRatesDetails.appendChild(container);
  return editRatesDetails;
};

const createRateInput = ({
  id,
  label,
  labelId,
  defaultRate,
  dataAttribute,
}: Rate) => {
  const input = createElement("input", id) as HTMLInputElement;
  input.setAttribute(dataAttribute(), defaultRate);
  input.value = defaultRate;
  input.addEventListener("change", (event) =>
    onChangeHandler(event, input, dataAttribute)
  );
  const inputLabel = createElement("label", labelId);
  inputLabel.textContent = label;
  inputLabel.appendChild(input);
  return inputLabel;
};

const onChangeHandler = (
  event: Event,
  input: HTMLInputElement,
  dataAttribute: Function
) => {
  const target = event.target as HTMLInputElement;
  input.setAttribute(dataAttribute(), target.value);
};

export const setRates = () => {
  const activeProject = getActiveProjectName();
  // const rates = document.getElementById(
  //   "edit-rates-container"
  // ) as HTMLDivElement;
  // const rates = container.childNodes;
  // if (rates) {
  //   rates.forEach((rate) => {
  //     const input = rate.firstChild as HTMLInputElement;
  //     console.log("input", input);
  //     const active
  //   });
  // }
  const weekdayRates = document.getElementById(
    "edit-rates-input-weekday"
  ) as HTMLInputElement;
  weekdayRates.value = weekdayRates.getAttribute(
    `data-project-${activeProject}-rate-weekday`
  );

  const saturdayRates = document.getElementById(
    "edit-rates-input-saturday"
  ) as HTMLInputElement;
  saturdayRates.value = saturdayRates.getAttribute(
    `data-project-${activeProject}-rate-saturday`
  );

  const sundayRates = document.getElementById(
    "edit-rates-input-sunday"
  ) as HTMLInputElement;
  sundayRates.value = sundayRates.getAttribute(
    `data-project-${activeProject}-rate-sunday`
  );

  const cut = document.getElementById(
    "edit-rates-input-cut"
  ) as HTMLInputElement;
  cut.value = cut.getAttribute(`data-project-${activeProject}-rate-cut`);

  const pensionPay = document.getElementById(
    "edit-rates-input-pension"
  ) as HTMLInputElement;
  pensionPay.value = pensionPay.getAttribute(
    `data-project-${activeProject}-rate-pension`
  );

  const holidayPay = document.getElementById(
    "edit-rates-input-holiday"
  ) as HTMLInputElement;
  holidayPay.value = holidayPay.getAttribute(
    `data-project-${activeProject}-rate-holiday`
  );

  const aga = document.getElementById(
    "edit-rates-input-aga"
  ) as HTMLInputElement;
  aga.value = aga.getAttribute(`data-project-${activeProject}-rate-aga`);

  const tax = document.getElementById(
    "edit-rates-input-tax"
  ) as HTMLInputElement;
  tax.value = tax.getAttribute(`data-project-${activeProject}-rate-tax`);
};
