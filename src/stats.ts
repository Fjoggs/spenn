import { DetailsElement, createDetailsElement, createElement } from "./util";

export interface Stats {
  statRows: StatRow[];
  statDetails: DetailsElement;
}

type StatRow = {
  id: string;
  text: string;
};

export const createStats = ({ statRows, statDetails }: Stats) => {
  const details = createDetailsElement(statDetails);
  const list = createElement("ul");
  statRows.forEach((statRow) => {
    list.appendChild(createStatRow(statRow));
  });
  details.appendChild(list);
  return details;
};

const createStatRow = ({ id, text }: StatRow) => {
  const liElement = createElement("li");
  liElement.textContent = text;
  const value = createElement("span", id);
  value.textContent = "0";
  liElement.appendChild(value);
  return liElement;
};
