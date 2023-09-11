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

export const getActiveProjectName = () =>
  document
    .getElementById("table")
    ?.getAttribute("data-active-project")
    ?.toLocaleLowerCase() || "default";
