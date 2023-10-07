import { MonthState } from "./calendar";
import { FilterRow } from "./filters";
import { ProjectRow } from "./project";
import { RateDetails, RateState } from "./rate";
import { Stats } from "./stats";
import { getActiveProjectName } from "./util";

export interface AppState {
  guiState: GuiState;
  state: State;
}

export interface GuiState {
  calendar: Calendar;
  calendarAttributes: CalendarAttributes;
  stats: Stats;
  rate: RateDetails;
  projectRow: ProjectRow;
  filterRow: FilterRow;
}

export interface State {
  monthState?: MonthState;
  rateStates?: RateState[];
}

export interface Calendar {
  locale: Intl.LocalesArgument;
  dateFormat: Intl.DateTimeFormatOptions;
}

export interface CalendarAttributes {
  dataAttributes: Array<(id: string) => string>;
}

const monthState: MonthState = {
  month: 9,
  values: [
    "",
    "1",
    "2",
    "3",
    "7.5",
    "",
    "",
    "",
    "5",
    "",
    "",
    "",
    "",
    "6",
    "",
    "",
    "",
    "10",
    "",
    "",
    "",
    "",
    "",
    "15",
    "",
    "",
    "",
    "17",
    "",
    "",
    "",
  ],
};

const table: Calendar = {
  locale: "en-GB",
  dateFormat: {
    month: "long",
  },
};

const calendarAttributes: CalendarAttributes = {
  dataAttributes: [
    (projectId: string) => `data-project-${projectId}-total-hours`,
    (projectId: string) => `data-project-${projectId}-total-income`,
  ],
};

const stats: Stats = {
  statRows: [
    {
      id: "hours-project",
      text: "Hours (project): ",
    },
    {
      id: "hours-combined",
      text: "Hours (combined): ",
    },
    {
      id: "income-project",
      text: "Income (project): ",
    },
    {
      id: "income-combined",
      text: "Income (combined): ",
    },
  ],
  statDetails: {
    detailId: "stats-details",
    summaryId: "stats-summary",
    summaryText: "Hours / Income",
  },
};

const rate: RateDetails = {
  details: {
    detailId: "edit-rates-details",
    summaryId: "edit-rates-summary",
    summaryText: "Edit project rates",
  },
  containerId: "edit-rates-container",
  rateInputs: [
    {
      id: "edit-rates-input-weekday",
      label: "Weekday",
      labelId: "edit-rates-label-weekday",
      defaultRate: "1309",
      dataAttribute: () =>
        `data-project-${getActiveProjectName()}-rate-weekday`,
    },
    {
      id: "edit-rates-input-saturday",
      label: "Saturday",
      labelId: "edit-rates-label-saturday",
      defaultRate: "1309",
      dataAttribute: () =>
        `data-project-${getActiveProjectName()}-rate-saturday`,
    },
    {
      id: "edit-rates-input-sunday",
      label: "Sunday",
      labelId: "edit-rates-label-sunday",
      defaultRate: "1309",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-sunday`,
    },
    {
      id: "edit-rates-input-cut",
      label: "% Cut (60% default)",
      labelId: "edit-rates-label-cut",
      defaultRate: "60",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-cut`,
    },
    {
      id: "edit-rates-input-pension",
      label: "% Pension (half paid by Noria)",
      labelId: "edit-rates-label-pension",
      defaultRate: "5",
      dataAttribute: () =>
        `data-project-${getActiveProjectName()}-rate-pension`,
    },
    {
      id: "edit-rates-input-holiday",
      label: "% Holiday pay (12% default)",
      labelId: "edit-rates-label-holiday",
      defaultRate: "12",
      dataAttribute: () =>
        `data-project-${getActiveProjectName()}-rate-holiday`,
    },
    {
      id: "edit-rates-input-aga",
      label: "% AGA (14.1% default)",
      labelId: "edit-rates-label-cut",
      defaultRate: "14.1",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-aga`,
    },
    {
      id: "edit-rates-input-tax",
      label: "% tax (flat rate, not clever)",
      labelId: "edit-rates-label-tax",
      defaultRate: "42",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-tax`,
    },
  ],
};

const rateStates: RateState[] = [
  {
    id: "edit-rates-input-weekday",
    value: "1400",
  },
];

const filterRow: FilterRow = {
  filterRowId: "button-column",
  filters: [
    {
      id: "toggle-view-income",
      label: "$",
      hotkey: "m",
      dataAttribute: () => `data-project-${getActiveProjectName()}-income`,
      filterMode: "income",
      readOnly: true,
    },
    {
      id: "toggle-view-hours",
      label: "H",
      hotkey: "h",
      dataAttribute: () => `data-project-${getActiveProjectName()}-hours`,
      filterMode: "hours",
      readOnly: false,
      isActive: true,
    },
  ],
};

const defaultProject = "Default";

const projectRow: ProjectRow = {
  projects: [defaultProject],
  inputId: "add-project",
  inputPlaceholder: "Add new project",
};

export const defaultGuiState: GuiState = {
  calendar: table,
  calendarAttributes,
  stats,
  rate,
  projectRow,
  filterRow,
};

export const defaultState: State = {
  monthState,
  rateStates,
};
