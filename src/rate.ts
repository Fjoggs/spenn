import { DetailsElement, createDetailsElement, createElement } from "./util";

export type RateDetails = {
  details: DetailsElement;
  containerId: string;
  rateInputs: Rate[];
};

type Rate = {
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
  input.textContent = defaultRate;
  const inputLabel = createElement("label", labelId);
  inputLabel.textContent = label;
  inputLabel.appendChild(input);
  return inputLabel;
};
