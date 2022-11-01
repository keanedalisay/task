export function delegateEvent(elem, event, slctr, func) {
  elem.addEventListener(event, (e) => {
    if (e.target.matches(slctr)) func(e);
  });
  return;
}

export function insertHTML(elem, childHtml) {
  elem.insertAdjacentHTML("beforeend", childHtml);
  return;
}

export function insertElem(elem, childElem) {
  elem.insertAdjacentElement("beforeend", childElem);
  return;
}

export function setTabIndex(elements) {
  elements.forEach((elem) => {
    const tabIndex = parseInt(elem.getAttribute("tabindex"));
    elem.setAttribute("tabindex", tabIndex ? 0 : -1);
  });
  return;
}

export function goalBtnHTML(goalId, goalName) {
  const goalBtn = `
  <button class="goalBtn" id="${goalId ? goalId : ""}" data-app="goalBtn">
    <div class="goalProgressBar">
        <div class="goalProgressBar-interval">
        </div>
    </div>
    <input class="goalBtnInput ${
      goalName ? "hide-elem" : ""
    }" data-app="goalBtnInput" type="text" placeholder="Goal Name...">
    <label class="goalBtn-label ${
      goalName ? "" : "hide-elem"
    }" data-app="goalBtnLabel">${goalName ? goalName : ""}</label>
  </button>`;
  return goalBtn;
}

export function taskBtnHTML(taskId, taskName, taskNote, taskDueDate, isDone) {
  const taskBtn = `
<div class="task hide-taskSettings ${isDone ? "completed-task" : ""}" id=${
    taskId ? taskId : ""
  } title="${taskName ? taskName : ""}">
  <div class="task-infoFrame" tabindex="0">
  <div class="checkbox ${isDone ? "check-checkbox" : ""}">
      <object class="checkbox-icon" data-status="${isDone ? "1" : "0"}" data="${
    isDone ? "../src/icons/checkIcon.svg" : ""
  }" type="text/svg+xml" tabindex="-1"></object>
  </div>
  <span class="task-dueDate ${taskDueDate ? "" : "hide-elem"}">${
    taskDueDate ? taskDueDate : ""
  }</span>
  <div class="task-nameFrame">
      <input class="task-nameInput ${
        taskName ? "hide-elem" : ""
      }" type="text" placeholder="What would you like to do?">
      <span class="task-name ${taskName ? "" : "hide-elem"}">${
    taskName || "What would you like to do?"
  }</span>
      <span class="task-tabName hide-elem">Inbox</span>
  </div>
</div>
<div class="task-noteFrame">
  <input class="task-noteInput ${
    taskNote ? "hide-elem" : ""
  }" type="text" placeholder="What would you like to keep in mind?"tabindex="-1">
  <span class="task-note ${taskNote ? "" : "hide-elem"}">${
    taskNote || "What would you like to keep in mind?"
  }</span>
</div>
<div class="task-btnFrame">
  <button class="task-btn" data-app="setTaskDateBtn" tabindex="-1">
      <div class="btnLblFrame btnLblFrame--task">
          <object class="btnLblFrame-icon" data="../src/icons/dateIcon.svg" type="text/svg+xml"
              tabindex="-1"></object>
          <span class="btnLblFrame-text">Date</span>
      </div>
  </button>
  <button class="task-btn" data-app="trashTaskBtn" tabindex="-1">
      <div class="btnLblFrame btnLblFrame--task">
          <object class="btnLblFrame-icon" data="../src/icons/trashIcon.svg" type="text/svg+xml"
              tabindex="-1"></object>
          <span class="btnLblFrame-text">Trash</span>
      </div>
  </button>
</div>
</div>
  `;

  return taskBtn;
}
