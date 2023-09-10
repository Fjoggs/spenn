const getActiveProjectName = () =>
  document
    .getElementById("table")
    ?.getAttribute("data-active-project")
    ?.toLocaleLowerCase();

enum ChangeEvent {
  AttributeChange = "attributes",
  ChildAddRemove = "childList",
}

const calculateProjectHours = (
  table: HTMLTableElement,
  inputElement: HTMLInputElement,
  totalProjectHours: number,
  oldValue: number
) => {
  const inputValue = Number(inputElement.value);
  let combinedHours = document.getElementById("hours-combined");
  let newProjectHours = "";
  let newCombinedHours = "";
  if (inputValue === 0) {
    // Value is now empty
    newProjectHours = (totalProjectHours - oldValue).toString();
    newCombinedHours = (
      Number(combinedHours?.textContent) - oldValue
    ).toString();
  } else {
    // Value has changed
    newProjectHours = (totalProjectHours + inputValue).toString();
    newCombinedHours = (
      Number(combinedHours?.textContent) + inputValue
    ).toString();
  }
  let projectHours = document.getElementById("hours-project");
  if (combinedHours && projectHours) {
    combinedHours.textContent = newCombinedHours;
    projectHours.textContent = newProjectHours;
    table.setAttribute(
      `data-project-${getActiveProjectName()}-total-hours`,
      newProjectHours
    );
  }
};

export const onChangeObserver = (
  records: MutationRecord[],
  observer: MutationObserver
) => {
  const table = document.getElementById("table") as HTMLTableElement;
  if (table) {
    const activeProjectName = getActiveProjectName();
    console.log("activeProjectName", activeProjectName);
    const totalProjectHours = Number(
      table.getAttribute(`data-project-${activeProjectName}-total-hours`)
    );
    for (const record of records) {
      if (record.type === ChangeEvent.ChildAddRemove) {
      } else if (record.type === ChangeEvent.AttributeChange) {
        const projectHours = document.getElementById("hours-project");
        if (
          record.attributeName === `data-project-${activeProjectName}-value`
        ) {
          const inputElement = record.target as HTMLInputElement;
          calculateProjectHours(
            table,
            inputElement,
            totalProjectHours,
            Number(record.oldValue)
          );
        }
        if (record.attributeName === "data-active-project") {
          if (projectHours) {
            projectHours.textContent = totalProjectHours.toString();
          }
          const tableBody = document.getElementById("tbody");
          const trElements = tableBody?.childNodes;
          if (trElements) {
            trElements.forEach((tr) => {
              const tdElements = tr.childNodes;
              if (tdElements) {
                tdElements.forEach((td) => {
                  if (td.firstChild) {
                    const input = td.firstChild as HTMLInputElement;
                    const value = input.getAttribute(
                      `data-project-${activeProjectName}-value`
                    );
                    if (value) {
                      input.value = value.toString();
                    } else {
                      input.value = "";
                    }
                  }
                });
              }
            });
          }
        }
      }
    }
  }
};

const oberserverConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
};

export const startObserving = (table: HTMLTableElement) => {
  const observer = new MutationObserver(onChangeObserver);
  observer.observe(table, oberserverConfig);
};
