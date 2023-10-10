import { MonthState } from "./calendar";
import { FilterRow } from "./filters";
import { ProjectRow } from "./project";
import { RateDetails, RateState } from "./rate";
import { Stats } from "./stats";

export interface GuiState {
  calendar: Calendar;
  calendarAttributes: CalendarAttributes;
  stats: Stats;
  rate: RateDetails;
  projectRow: ProjectRow;
  filterRow: FilterRow;
}

export interface ProjectState {
  name: string;
  monthStates?: MonthState[];
  rateStates?: RateState[];
}

export interface Calendar {
  locale: Intl.LocalesArgument;
  dateFormat: Intl.DateTimeFormatOptions;
}

export interface CalendarAttributes {
  dataAttributes: string[];
}

const calendar: Calendar = {
  locale: "en-GB",
  dateFormat: {
    month: "long",
  },
};

const calendarAttributes: CalendarAttributes = {
  dataAttributes: [
    "data-project-PROJECT_NAME-total-hours",
    "data-project-PROJECT_NAME-total-income",
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
      dataAttribute: "data-project-PROJECT_NAME-rate-weekday",
    },
    {
      id: "edit-rates-input-saturday",
      label: "Saturday",
      labelId: "edit-rates-label-saturday",
      defaultRate: "1309",
      dataAttribute: "data-project-PROJECT_NAME-rate-saturday",
    },
    {
      id: "edit-rates-input-sunday",
      label: "Sunday",
      labelId: "edit-rates-label-sunday",
      defaultRate: "1309",
      dataAttribute: "data-project-PROJECT_NAME-rate-sunday",
    },
    {
      id: "edit-rates-input-cut",
      label: "% Cut (60% default)",
      labelId: "edit-rates-label-cut",
      defaultRate: "60",
      dataAttribute: "data-project-PROJECT_NAME-rate-cut",
    },
    {
      id: "edit-rates-input-pension",
      label: "% Pension (half paid by Noria)",
      labelId: "edit-rates-label-pension",
      defaultRate: "5",
      dataAttribute: "data-project-PROJECT_NAME-rate-pension",
    },
    {
      id: "edit-rates-input-holiday",
      label: "% Holiday pay (12% default)",
      labelId: "edit-rates-label-holiday",
      defaultRate: "12",
      dataAttribute: "data-project-PROJECT_NAME-rate-holiday",
    },
    {
      id: "edit-rates-input-aga",
      label: "% AGA (14.1% default)",
      labelId: "edit-rates-label-cut",
      defaultRate: "14.1",
      dataAttribute: "data-project-PROJECT_NAME-rate-aga",
    },
    {
      id: "edit-rates-input-tax",
      label: "% tax (flat rate, not clever)",
      labelId: "edit-rates-label-tax",
      defaultRate: "42",
      dataAttribute: "data-project-PROJECT_NAME-rate-tax",
    },
  ],
};

const filterRow: FilterRow = {
  filterRowId: "button-column",
  filters: [
    {
      id: "toggle-view-income",
      label: "$",
      hotkey: "m",
      dataAttribute: "data-project-PROJECT_NAME-income",
      filterMode: "income",
      readOnly: true,
    },
    {
      id: "toggle-view-hours",
      label: "H",
      hotkey: "h",
      dataAttribute: "data-project-PROJECT_NAME-hours",
      filterMode: "hours",
      readOnly: false,
      isActive: true,
    },
  ],
};

const projectRow: ProjectRow = {
  inputId: "add-project",
  inputPlaceholder: "Add new project",
};

export const defaultGuiState: GuiState = {
  calendar,
  calendarAttributes,
  stats,
  rate,
  projectRow,
  filterRow,
};

export const returnGuiState = () => ({
  calendar: getCalendar(),
  calendarAttributes: getCalendarAttributes(),
  stats: getStats(),
  filterRow: getFilterRow(),
  projectRow: getProjectRow(),
  rate: getRateDetails(),
});

const getCalendar = (): Calendar => {
  const locale = "en-GB";
  const dateFormat: Intl.DateTimeFormatOptions = {
    month: "long",
  };
  return {
    locale,
    dateFormat,
  };
};

const getCalendarAttributes = (): CalendarAttributes => ({
  dataAttributes: [
    "data-project-PROJECT_NAME-total-hours",
    "data-project-PROJECT_NAME-total-income",
  ],
});

const getStats = (): Stats => ({
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
});

const getFilterRow = (): FilterRow => {
  const filterRow: FilterRow = {
    filterRowId: "button-column",
    filters: [
      {
        id: "toggle-view-income",
        label: "$",
        hotkey: "m",
        dataAttribute: "data-project-PROJECT_NAME-income",
        filterMode: "income",
        readOnly: true,
      },
      {
        id: "toggle-view-hours",
        label: "H",
        hotkey: "h",
        dataAttribute: "data-project-PROJECT_NAME-hours",
        filterMode: "hours",
        readOnly: false,
        isActive: true,
      },
    ],
  };
  return filterRow;
};

const getProjectRow = (): ProjectRow => {
  return {
    inputId: "add-project",
    inputPlaceholder: "Add new project",
  };
};

const getRateDetails = (): RateDetails => {
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
        dataAttribute: "data-project-PROJECT_NAME-rate-weekday",
      },
      {
        id: "edit-rates-input-saturday",
        label: "Saturday",
        labelId: "edit-rates-label-saturday",
        defaultRate: "1309",
        dataAttribute: "data-project-PROJECT_NAME-rate-saturday",
      },
      {
        id: "edit-rates-input-sunday",
        label: "Sunday",
        labelId: "edit-rates-label-sunday",
        defaultRate: "1309",
        dataAttribute: "data-project-PROJECT_NAME-rate-sunday",
      },
      {
        id: "edit-rates-input-cut",
        label: "% Cut (60% default)",
        labelId: "edit-rates-label-cut",
        defaultRate: "60",
        dataAttribute: "data-project-PROJECT_NAME-rate-cut",
      },
      {
        id: "edit-rates-input-pension",
        label: "% Pension (half paid by Noria)",
        labelId: "edit-rates-label-pension",
        defaultRate: "5",
        dataAttribute: "data-project-PROJECT_NAME-rate-pension",
      },
      {
        id: "edit-rates-input-holiday",
        label: "% Holiday pay (12% default)",
        labelId: "edit-rates-label-holiday",
        defaultRate: "12",
        dataAttribute: "data-project-PROJECT_NAME-rate-holiday",
      },
      {
        id: "edit-rates-input-aga",
        label: "% AGA (14.1% default)",
        labelId: "edit-rates-label-cut",
        defaultRate: "14.1",
        dataAttribute: "data-project-PROJECT_NAME-rate-aga",
      },
      {
        id: "edit-rates-input-tax",
        label: "% tax (flat rate, not clever)",
        labelId: "edit-rates-label-tax",
        defaultRate: "42",
        dataAttribute: "data-project-PROJECT_NAME-rate-tax",
      },
    ],
  };
  return rate;
};
