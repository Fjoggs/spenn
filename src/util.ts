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

export const appendChildren = (children: HTMLElement[], root = document) => {
  children.forEach((child) => {
    root.appendChild(child);
  });
};
