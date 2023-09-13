import { FilterRow } from "./filters";
import { ProjectRow } from "./project";
import { RateDetails } from "./rate";
import { Stats } from "./stats";
import { getActiveProjectName } from "./util";

export interface State {
  table: Table;
  stats: Stats;
  rate: RateDetails;
  projectRow: ProjectRow;
}

export interface Table {
  dataAttributes: Array<(id: string) => string>;
}

const table: Table = {
  dataAttributes: [
    (id: string) => `data-project-${id}-total-hours`,
    (id: string) => `data-project-${id}-income`,
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
      label: "% cut (45% default)",
      labelId: "edit-rates-label-cut",
      defaultRate: "45",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-cut`,
    },
    {
      id: "edit-rates-input-tax",
      label: "% tax",
      labelId: "edit-rates-label-tax",
      defaultRate: "42",
      dataAttribute: () => `data-project-${getActiveProjectName()}-rate-tax`,
    },
  ],
};

const filterRow: FilterRow = {
  filterRowId: "button-column",
  filters: [
    {
      id: "toggle-view-money",
      label: "$",
      hotkey: "m",
      dataAttribute: () => `data-project-${getActiveProjectName()}-income`,
      readOnly: true,
    },
    {
      id: "toggle-view-hours",
      label: "H",
      hotkey: "h",
      dataAttribute: () => `data-project-${getActiveProjectName()}-hours`,
      readOnly: false,
      isActive: true,
    },
  ],
};

const projectRow: ProjectRow = {
  defaultProjectName: "Default",
  inputId: "add-project",
  inputPlaceholder: "Add new project",
  filterRow,
};

export const defaultState: State = {
  table,
  stats,
  rate,
  projectRow,
};
