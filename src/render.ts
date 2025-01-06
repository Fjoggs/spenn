import { assert } from "console";
import { renderCalendar, renderHeader } from "./calendar";
import { defaultGuiState } from "./guiState";
import { createLoginRow } from "./login";
import {
  appObserver,
  rateObserver,
  recalculateIncome,
  tableObserver,
} from "./observer";
import { createProjectRow, setHours } from "./project";
import { createRateDetails, setRateAttributes } from "./rate";
import { AppState } from "./state";
import { createStats } from "./stats";
import { createElement } from "./util";

const fetchState = async () => {
  const response = await fetch("/api/get?user=fjogen");
  const appState = (await response.json()) as AppState;
  if (!appState.guiState) {
    appState.guiState = defaultGuiState;
  }
  if (!appState.state) {
    appState.state = {};
  }

  return appState;
};

export const renderApp = async (
  date: Date,
  header: HTMLHeadingElement,
  appContainer: HTMLDivElement,
  firstRender = true,
) => {
  try {
    const appState = await fetchState();
    const getFirstProject = () => {
      if (appState.state.projects && appState.state.projects?.length > 0) {
        return appState.state.projects[0];
      }
    };
    const firstProject = getFirstProject();

    const calendar = renderCalendar(date, firstProject?.yearStates);

    const stats = createStats(appState.guiState.stats);
    const editRates = createRateDetails(
      appState.guiState.rate,
      firstProject?.rateStates,
    );

    const loginRow = createLoginRow();
    const heading = createElement("h1");
    heading.textContent = "Spenn";
    header.appendChild(heading);
    header.appendChild(loginRow);

    appContainer.appendChild(renderHeader(date, appState.guiState.calendar));
    appContainer.appendChild(calendar);

    const projectRow = createProjectRow(
      appState.guiState.projectRow,
      appState.guiState.filterRow,
      appState.guiState.rate.rateInputs,
      appState.guiState.calendarAttributes,
      appState.state?.projects,
    );
    appContainer.appendChild(projectRow);

    appContainer.appendChild(stats);
    appContainer.appendChild(editRates);

    setRateAttributes(appState.state?.projects);
    setHours(appState.state?.projects);

    if (firstRender) {
      // Observers are not removed when the nodes connected to them are removed
      appObserver(appContainer);
      rateObserver(editRates);
      tableObserver(calendar);
    }

    recalculateIncome();
  } catch (error) {
    const errorContainer = document.getElementById("error") as HTMLDivElement;
    const errorTextContainer = document.getElementById(
      "error-message",
    ) as HTMLParagraphElement;
    if (errorContainer && errorTextContainer) {
      errorContainer.style.display = "flex";
      errorTextContainer.textContent = `${error}`;
    }
    console.log("error", error);
  }
};
