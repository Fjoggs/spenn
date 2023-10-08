export type DetailsElement = {
  detailId: string;
  summaryId: string;
  summaryText: string;
};

export const createElement = (
  tagName: keyof HTMLElementTagNameMap,
  id?: string
) => {
  const element = document.createElement(tagName);
  if (id) {
    element.setAttribute("id", id);
  }
  return element;
};

export const createDetailsElement = ({
  detailId,
  summaryId,
  summaryText,
}: DetailsElement) => {
  const details = createElement("details", detailId);
  const summary = createElement("summary", summaryId);
  summary.textContent = summaryText;
  details.appendChild(summary);
  return details;
};
