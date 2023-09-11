import { renderCalendar } from "./src/calendar";
import { startObserving } from "./src/observer";
import { createEditRatesDetails, createProjectRow } from "./src/project";
import { statsState } from "./src/state";
import { createStats } from "./src/stats";

const app = document.getElementById("app");

const stats = createStats(statsState);
const table = renderCalendar();
const editRates = createEditRatesDetails();

if (app) {
  // if (localStorage.getItem("state")) {
  //   console.log("fetching state");
  //   app.innerHTML = localStorage.getItem("state") || "";
  // } else {
  app.appendChild(table);
  const projectRow = createProjectRow();
  app.appendChild(projectRow);
  app.appendChild(stats);
  app.appendChild(editRates);
  // }
  // const appObserver = new MutationObserver(() => {
  // console.log("storing in storage");
  // localStorage.setItem("state", app.innerHTML);
  // });
  // appObserver.observe(app, oberserverConfig);
}

startObserving(table);
