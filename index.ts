import { renderCalendar } from "./src/calendar";
import { startObserving } from "./src/observer";
import { createEditRatesDetails, createProjectRow } from "./src/project";
import { createStats } from "./src/stats";
const app = document.getElementById("app");

const stats = createStats();
const table = renderCalendar();

const editRates = createEditRatesDetails();

if (app) {
  // if (localStorage.getItem("state")) {
  //   console.log("fetching state");
  //   app.innerHTML = localStorage.getItem("state") || "";
  // } else {
  app.appendChild(table);
  const projectRow = createProjectRow();
  app.appendChild(stats);
  app.appendChild(projectRow);
  app.appendChild(editRates);
  // }
  const appObserver = new MutationObserver(() => {
    // console.log("storing in storage");
    // localStorage.setItem("state", app.innerHTML);
  });
  // appObserver.observe(app, oberserverConfig);
}

startObserving(table as HTMLTableElement);
