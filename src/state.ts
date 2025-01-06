import { GuiState, returnGuiState } from "./guiState";
import { getProjectsArray } from "./project";
import { RateState } from "./rate";

export interface AppState {
  guiState: GuiState;
  state: State;
}
export interface State {
  projects?: ProjectState[];
}

export interface ProjectState {
  name: string;
  rateStates?: RateState[];
  yearStates?: YearState[];
}

export interface YearState {
  year: number;
  monthStates?: MonthState[];
}

export type MonthState = {
  month: number;
  hours: string[];
};

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
      yearStates: getActiveYearState(projectName),
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

const getActiveYearState = (projectName: string): YearState[] => {
  const calendar = document.getElementById("table");
  let activeYear = new Date().getFullYear().toString();
  if (calendar) {
    activeYear = calendar.getAttribute("data-year") || activeYear;
  }
  const monthStates: MonthState[] = getCurrentMonthState(projectName);
  // const monthStates: MonthState[] = [];
  const activeMonthState = getActiveMonthState(projectName);
  monthStates.push(activeMonthState);
  return [
    {
      year: Number(activeYear),
      monthStates,
    },
  ];
};

const getCurrentMonthState = (projectName: string) => {
  const calendar = document.getElementById("table");
  let activeMonth = new Date().getMonth().toString();
  let activeYear = new Date().getFullYear().toString();
  if (calendar) {
    activeMonth = calendar.getAttribute("data-month") || activeMonth;
    activeYear = calendar.getAttribute("data-year") || activeYear;
  }

  // const activeProject = currentAppState.state.projects?.find(
  //   (project) => projectName === project.name,
  // );
  // const monthStates = activeProject?.yearStates?.find(
  //   (yearState) => yearState.year === Number(activeYear),
  // );
  return [];
};

const getActiveMonthState = (projectName: string): MonthState => {
  const calendar = document.getElementById("table");
  let activeMonth = new Date().getMonth().toString();
  if (calendar) {
    activeMonth = calendar.getAttribute("data-month") || activeMonth;
  }
  console.log("activeMonth", activeMonth);

  const values: string[] = [];
  const days = document.querySelectorAll("input.calendar-day");
  if (days) {
    days.forEach((day) => {
      const value = day.getAttribute(`data-project-${projectName}-hours`);
      values.push(value || "");
    });
  }

  const monthState: MonthState = {
    month: Number(activeMonth),
    hours: values,
  };

  return monthState;
};
