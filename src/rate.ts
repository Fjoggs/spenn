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
  dataAttribute: string;
};

export type RateState = {
  id: string;
  value: string;
};

export const createRateDetails = (
  rate: RateDetails,
  rateStates?: RateState[]
) => {
  const editRatesDetails = createDetailsElement(rate.details);
  const container = createElement("div", rate.containerId);
  rate.rateInputs.forEach((rateInput) => {
    const value = rateStates?.find(
      (rateState) => rateState.id === rateInput.id
    )?.value;
    container.appendChild(createRateInput(rateInput, value));
  });
  editRatesDetails.appendChild(container);
  return editRatesDetails;
};

const createRateInput = (
  { id, label, labelId, defaultRate, dataAttribute }: Rate,
  value?: string
) => {
  const input = createElement("input", id) as HTMLInputElement;
  const dataAttributeActiveProject = dataAttribute.replace(
    "PROJECT_NAME",
    getActiveProjectName()
  );
  input.setAttribute(dataAttributeActiveProject, defaultRate);
  input.addEventListener("change", (event) =>
    onChangeHandler(event, input, dataAttributeActiveProject)
  );
  if (value) {
    input.value = value;
  } else {
    input.value = defaultRate;
  }

  const inputLabel = createElement("label", labelId);
  inputLabel.textContent = label;
  inputLabel.appendChild(input);
  return inputLabel;
};

const onChangeHandler = (
  event: Event,
  input: HTMLInputElement,
  dataAttribute: string,
  value?: string
) => {
  const target = event.target as HTMLInputElement;
  if (value) {
    input.setAttribute(dataAttribute, value);
  } else {
    input.setAttribute(dataAttribute, target.value);
  }
};
