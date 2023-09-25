import { DetailsElement, createDetailsElement, createElement } from "./util";

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
