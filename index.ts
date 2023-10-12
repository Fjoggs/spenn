/// <reference lib="dom" />

import { renderCalendar } from "./src/calendar";
import { GuiState, defaultGuiState } from "./src/guiState";
import { login } from "./src/login";
import {
  RecordType,
  rateObserver,
  recalculateIncome,
  tableObserver,
} from "./src/observer";
import {
  createProjectRow,
  getActiveProjectName,
  setHours,
} from "./src/project";
import { createRateDetails, setRateAttributes } from "./src/rate";
import { AppState, State, returnCalendarState } from "./src/state";
import { createStats } from "./src/stats";

const appContainer = document.getElementById("app") as HTMLDivElement;

let guiState: GuiState = defaultGuiState;
let state: State = {};

const fetchState = async () => {
  const response = await fetch("/api/get?user=fjogen");
  const appState = (await response.json()) as AppState;
  console.log("appStae", appState);
  if (appState) {
    if (appState.guiState) {
      console.log("guiState", appState.guiState);
      guiState = appState.guiState;
    }
    if (appState.state) {
      console.log("state", appState.state);
      state = appState.state;
    }
  }
};

const activeProjectState = () =>
  state.projects?.find((project) => {
    return project.name === getActiveProjectName();
  });

const isTotalChange = (attributeName: string | null) => {
  if (attributeName === `data-project-${getActiveProjectName()}-total-income`) {
    return true;
  } else if (
    attributeName === `data-project-${getActiveProjectName()}-total-hours`
  ) {
    return true;
  }
  return false;
};

const renderApp = async (appContainer: HTMLDivElement) => {
  await fetchState();

  const calendar = renderCalendar(
    guiState.calendar,
    activeProjectState()?.monthStates
  );
  tableObserver(calendar);

  try {
    const stats = createStats(guiState.stats);
    const editRates = createRateDetails(
      guiState.rate,
      activeProjectState()?.rateStates
    );

    rateObserver(editRates);
    const loginRow = login();
    appContainer.appendChild(loginRow);
    appContainer.appendChild(calendar);
    const projectRow = createProjectRow(
      guiState.projectRow,
      guiState.filterRow,
      guiState.rate.rateInputs,
      guiState.calendarAttributes,
      state.projects
    );
    appContainer.appendChild(projectRow);
    appContainer.appendChild(stats);
    appContainer.appendChild(editRates);

    setRateAttributes(state.projects);
    setHours(state.projects);

    const appObserver = new MutationObserver((records: MutationRecord[]) => {
      let updateState = false;
      for (const record of records) {
        if (record.type === RecordType.AttributeChange) {
          if (isTotalChange(record.attributeName)) {
            // We dont store this field in state
            continue;
          } else {
            updateState = true;
            break;
          }
        }
      }
      if (updateState) {
        const currentState = returnCalendarState();
        const body = {
          user: "fjogen",
          state: currentState,
        };
        fetch("/api/post", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    });
    appObserver.observe(appContainer, {
      attributes: true,
      childList: false,
      subtree: true,
      attributeOldValue: true,
    });
    recalculateIncome();
  } catch (error) {
    console.log("error", error);
  }
};

if (appContainer) {
  renderApp(appContainer);
}
