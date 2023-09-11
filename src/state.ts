import { Stats } from "./stats";

export const statsState: Stats = {
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
