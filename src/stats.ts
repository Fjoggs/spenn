import { createElement, getActiveProjectName } from "./util";

const createStatsDetails = () => {
  const statsDetails = createElement("details", "stats-details");
  const summary = createElement("summary", "stats-summary");
  summary.textContent = "Hours / Income";
  statsDetails.appendChild(summary);
  return statsDetails;
};

const createStatRow = (id: string, text: string) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const projectHours = createElement("span", id);
  projectHours.textContent = "0";
  liElement.appendChild(projectHours);
  return liElement;
};

export const createStats = () => {
  const details = createStatsDetails();
  const list = createElement("ul");
  const projectHoursListElement = createStatRow(
    "hours-project",
    "Hours (project): "
  );
  const combinedHoursListElement = createStatRow(
    "hours-combined",
    "Hours (combined): "
  );
  const projectIncomeListElement = createStatRow(
    "income-project",
    "Income (project): "
  );
  const combinedIncomeListElement = createStatRow(
    "income-combined",
    "Income (combined): "
  );
  list.appendChild(projectHoursListElement);
  list.appendChild(combinedHoursListElement);
  list.appendChild(projectIncomeListElement);
  list.appendChild(combinedIncomeListElement);
  details.appendChild(list);
  return details;
};
