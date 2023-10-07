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

export const getActiveProjectName = () =>
  document
    .getElementById("table")
    ?.getAttribute("data-active-project")
    ?.toLocaleLowerCase() || "default";

interface CalendarState {
  projects: Project[];
}

interface Project {
  id: string;
  totalHours: number;
  totalIncome: number;
  dayStates: CalendarDay[];
}

interface CalendarDay {}

export const returnCalendarState = () => {
  const table = document.getElementById("table");
  const projectRow = document.getElementById("project-row");
  const buttons = projectRow?.getElementsByTagName("button");
  // const calendarState: CalendarState = {};
};
