/// <reference lib="dom" />

import { renderCalendar } from "./src/calendar";
import { rateObserver, recalculateIncome, tableObserver } from "./src/observer";
import { createProjectRow, recalculateHours } from "./src/project";
import { createRateDetails } from "./src/rate";
import {
  AppState,
  GuiState,
  State,
  defaultGuiState,
  defaultState,
} from "./src/state";
import { createStats } from "./src/stats";
import { returnCalendarState } from "./src/util";

const app = document.getElementById("app");

let guiState: GuiState = defaultGuiState;
let state: State = {};
let appState: AppState;
const localStorageKey = "spenn-app-state";
if (localStorage.getItem(localStorageKey)) {
  console.log("setting state = defaultState");
  appState = JSON.parse(localStorage.getItem(localStorageKey) || "");
  // if (appState.guiState) {
  // guiState = appState.guiState
  // }
  // if (appState.state) {
  // state = appState.state;
  // }
  state = defaultState;
}
const calendar = renderCalendar(guiState.calendar, state?.monthState);

if (app) {
  try {
    const stats = createStats(guiState.stats);
    const editRates = createRateDetails(guiState.rate, state?.rateStates);
    rateObserver(editRates);

    app.appendChild(calendar);
    const projectRow = createProjectRow(
      guiState.projectRow,
      guiState.filterRow,
      guiState.rate.rateInputs,
      guiState.calendarAttributes
    );
    app.appendChild(projectRow);
    app.appendChild(stats);
    app.appendChild(editRates);

    const appObserver = new MutationObserver(() => {
      console.log("storing in storage");
      returnCalendarState();
      localStorage.setItem(localStorageKey, JSON.stringify(defaultGuiState));
    });
    appObserver.observe(app, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
    });
    recalculateHours();
    recalculateIncome();
  } catch (error) {
    console.log("error", error);
  }
}

tableObserver(calendar);
