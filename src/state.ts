import { MonthState } from "./calendar";
import { GuiState, returnGuiState } from "./guiState";
import { getProjectsArray } from "./project";
import { RateState } from "./rate";

export interface AppState {
  guiState?: GuiState;
  state?: State;
}
export interface State {
  projects?: ProjectState[];
}

export interface ProjectState {
  name: string;
  monthStates?: MonthState[];
  rateStates?: RateState[];
}

const rateStates: RateState[] = [
  {
    id: "edit-rates-input-weekday",
    value: "1400",
  },
];

export const defaultState: State = {
  projects: [
    {
      name: "Default",
      rateStates,
    },
  ],
};

export const returnCalendarState = () => {
  const guiState = returnGuiState();
  const state = getState();
  return {
    guiState,
    state,
  };
};

const getState = (): State => ({
  projects: getProjects(),
});

const getProjects = (): ProjectState[] => {
  let projects: ProjectState[] = [];
  const projectsArray = getProjectsArray();
  projectsArray.forEach((projectName) => {
    const project: ProjectState = {
      name: projectName,
      monthStates: getMonthState(projectName),
      rateStates: getRates(projectName),
    };
    projects.push(project);
  });
  return projects;
};

const getRates = (projectName: string): RateState[] | [] => {
  const rateContainer = document.getElementById("edit-rates-container");
  let rateState: RateState[] = [];
  if (rateContainer) {
    rateContainer.childNodes.forEach((element) => {
      if (element.lastChild) {
        const input = element.lastChild as HTMLInputElement;
        const rateId = input.id.replace("edit-rates-input-", "");
        rateState.push({
          id: input.id,
          value:
            input.getAttribute(`data-project-${projectName}-rate-${rateId}`) ||
            "",
        });
      }
    });
  }
  return rateState;
};

const getMonthState = (projectName: string): MonthState[] => {
  const values: string[] = [];
  const monthState: MonthState = {
    month: new Date().getMonth(),
    values,
  };

  const days = document.querySelectorAll("input.calendar-day");
  if (days) {
    days.forEach((day) => {
      const value = day.getAttribute(`data-project-${projectName}-hours`);
      values.push(value || "");
    });
  }
  return [monthState];
};
