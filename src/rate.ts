import { getActiveProjectName } from "./project";
import { ProjectState } from "./state";
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
  input.addEventListener("change", (event) =>
    onChangeHandler(event, input, dataAttribute)
  );
  if (value) {
    input.value = value;
    input.setAttribute(dataAttributeActiveProject, value);
  } else {
    input.value = defaultRate;
    input.setAttribute(dataAttributeActiveProject, defaultRate);
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
  const dataAttributeActiveProject = dataAttribute.replace(
    "PROJECT_NAME",
    getActiveProjectName()
  );
  const target = event.target as HTMLInputElement;
  if (value) {
    input.setAttribute(dataAttributeActiveProject, value);
  } else {
    input.setAttribute(dataAttributeActiveProject, target.value);
  }
};

export const setRateAttributes = (projects?: ProjectState[]) => {
  if (projects) {
    projects.forEach((project) => {
      if (project.rateStates) {
        project.rateStates.forEach((rateState) => {
          const input = document.getElementById(rateState.id);
          setRateAttributeValue(rateState, project, input);
        });
      }
    });
  }
};

const setRateAttributeValue = (
  rateState: RateState,
  project: ProjectState,
  input: HTMLElement | null
) => {
  if (input) {
    const rateId = input.id.replace("edit-rates-input-", "");
    if (rateState.value) {
      input.setAttribute(
        `data-project-${project.name}-rate-${rateId}`,
        rateState.value
      );
    }
  }
};
