/// <reference lib="dom" />

import { renderCalendar } from "./src/calendar";
import { rateObserver, recalculateIncome, tableObserver } from "./src/observer";
import {
  createProjectRow,
  getActiveProjectName,
  setHours,
} from "./src/project";
import { createRateDetails, setRateAttributes } from "./src/rate";
import {
  AppState,
  GuiState,
  State,
  defaultGuiState,
  defaultState,
  returnCalendarState,
} from "./src/state";
import { createStats } from "./src/stats";
import { createElement } from "./src/util";

const app = document.getElementById("app");

let guiState: GuiState = defaultGuiState;
let state: State = {};
let appState: AppState;
const localStorageKey = "spenn-app-state";

if (localStorage.getItem(localStorageKey)) {
  appState = JSON.parse(localStorage.getItem(localStorageKey) || "");
  if (appState.guiState) {
    guiState = appState.guiState;
  }
  if (appState.state) {
    state = appState.state;
  } else {
    state = defaultState;
  }
}

const activeProjectState = state.projects?.find(
  (project) => project.name === getActiveProjectName()
);

const calendar = renderCalendar(
  guiState.calendar,
  activeProjectState?.monthStates
);

if (app) {
  try {
    const stats = createStats(guiState.stats);
    console.log("project", activeProjectState);
    const editRates = createRateDetails(
      guiState.rate,
      activeProjectState?.rateStates
    );

    rateObserver(editRates);

    app.appendChild(calendar);
    const projectRow = createProjectRow(
      guiState.projectRow,
      guiState.filterRow,
      guiState.rate.rateInputs,
      guiState.calendarAttributes,
      state.projects
    );
    app.appendChild(projectRow);
    app.appendChild(stats);
    app.appendChild(editRates);

    setRateAttributes(state.projects);
    setHours(state.projects);

    const appObserver = new MutationObserver(() => {
      const currentState = returnCalendarState();
      console.log("storing in storage");
      localStorage.setItem(localStorageKey, JSON.stringify(currentState));
    });
    appObserver.observe(app, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
    });
    recalculateIncome();
    const button = createElement("button");
    button.textContent = "Clear storage";
    button.addEventListener("click", () => {
      localStorage.removeItem(localStorageKey);
    });
    app.appendChild(button);
  } catch (error) {
    console.log("error", error);
  }
}

tableObserver(calendar);
