import { createElement } from "./util";

const createStatRow = (id: string, text: string) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const projectHours = createElement("span", id);
  projectHours.textContent = "0";
  liElement.appendChild(projectHours);
  return liElement;
};

export const createStats = () => {
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
  return list;
};
