/// <reference lib="dom" />

import { renderCalendar } from "./src/calendar";
import { rateObserver, tableObserver } from "./src/observer";
import { createProjectRow } from "./src/project";
import { createEditRatesDetails } from "./src/rate";
import { State, defaultState } from "./src/state";
import { createStats } from "./src/stats";

const app = document.getElementById("app");

const table = renderCalendar();

if (app) {
  let state: State = defaultState;
  // const localStorageKey = "spenn-app-state";
  // if (localStorage.getItem(localStorageKey)) {
  //   state = JSON.parse(localStorage.getItem(localStorageKey) || "");
  // }
  const stats = createStats(state.stats);
  const editRates = createEditRatesDetails(state.rate);
  rateObserver(editRates);

  app.appendChild(table);
  const projectRow = createProjectRow(
    state.projectRow,
    state.filterRow,
    state.rate.rateInputs,
    state.calendarAttributes
  );
  app.appendChild(projectRow);
  app.appendChild(stats);
  app.appendChild(editRates);
  // }
  // const appObserver = new MutationObserver(() => {
  //   console.log("storing in storage");
  //   localStorage.setItem(localStorageKey, JSON.stringify(defaultState));
  // });
  // appObserver.observe(app, {
  //   attributes: true,
  //   childList: true,
  //   subtree: true,
  //   attributeOldValue: true,
  // });
}

tableObserver(table);
