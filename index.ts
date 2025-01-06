/// <reference lib="dom" />
import { renderApp } from "./src/render";

const header = document.getElementById("header") as HTMLDivElement;
const appContainer = document.getElementById("app") as HTMLDivElement;

if (header && appContainer) {
  const today = new Date();
  renderApp(today, header, appContainer);
}
