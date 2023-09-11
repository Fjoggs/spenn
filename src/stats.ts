import { createElement } from "./util";

export interface Stats {
  statRows: StatRow[];
  statDetails: StatDetails;
}

type StatRow = {
  id: string;
  text: string;
};

type StatDetails = {
  detailId: string;
  summaryId: string;
  summaryText: string;
};

export const createStats = ({ statRows, statDetails }: Stats) => {
  const details = createStatsDetails(statDetails);
  const list = createElement("ul");
  statRows.forEach((statRow) => {
    list.appendChild(createStatRow(statRow));
  });
  details.appendChild(list);
  return details;
};

const createStatsDetails = ({
  detailId,
  summaryId,
  summaryText,
}: StatDetails) => {
  const statsDetails = createElement("details", detailId);
  const summary = createElement("summary", summaryId);
  summary.textContent = summaryText;
  statsDetails.appendChild(summary);
  return statsDetails;
};

const createStatRow = ({ id, text }: StatRow) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const projectHours = createElement("span", id);
  projectHours.textContent = "0";
  liElement.appendChild(projectHours);
  return liElement;
};
