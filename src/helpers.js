import { dTemp } from "./date.js";
const d = new dTemp();

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

export function getDueTaskCount(tasks) {
  let dueTaskCount = 0;
  tasks.forEach((task) => {
    if (d.isPastDue(task.tDueDate)) dueTaskCount++;
    return;
  });
  return dueTaskCount;
}

export function setTabIndex(elements) {
  if (!elements.length) {
    const tabIndex = parseInt(elements.getAttribute("tabindex"));
    elements.setAttribute("tabindex", tabIndex ? 0 : -1);
    return;
  }
  elements.forEach((elem) => {
    const tabIndex = parseInt(elem.getAttribute("tabindex"));
    elem.setAttribute("tabindex", tabIndex ? 0 : -1);
  });
  return;
}

export function goalBtnHTML(goalId, goalName) {
  const goalBtn = `
  <button class="goalBtn" id="${goalId ? goalId : ""}" data-app="goalBtn">
    <div class="goalProgressBar" data-app="goalProgressBar">
        <div class="goalProgressBar-interval" data-app="goalProgressInterval">
        </div>
    </div>
    <input class="goalBtn-input ${
      goalName ? "elem-hide" : ""
    }" data-app="goalBtnInput" type="text" placeholder="Goal Name...">
    <label class="goalBtn-label ${
      goalName ? "" : "elem-hide"
    }" data-app="goalBtnLabel">${goalName ? goalName : ""}</label>
  </button>`;
  return goalBtn;
}

export function taskBtnHTML(
  taskId,
  taskName,
  taskNote,
  taskDueDate,
  isDone,
  taskContent
) {
  const taskBtn = `
<div class="task task-collapse ${isDone ? "task-complete" : ""}" id="${
    taskId ? taskId : ""
  }" data-app="task">
  <div class="task-info" data-app="taskInfo"tabindex="0">
  <div class="checkbox ${
    isDone ? "check" : ""
  }" data-app="taskCheckbox" tabindex="0">
      <object class="checkbox-icon" data-status="${isDone ? "1" : "0"}" data="${
    isDone ? "icons/checkIcon.svg" : ""
  }" type="text/svg+xml" tabindex="-1">Task Check Icon</object>
  </div>
  <object class="task-today ${
    d.isDateNow(taskDueDate) ? "" : "elem-hide"
  }" data="icons/starIcon.svg" type="text/svg+xml" tabindex="-1">Task Today Icon</object>
  <object class="task-pastDue ${
    d.isPastDue(taskDueDate) ? "" : "elem-hide"
  }" data="icons/flagIcon.svg" type="text/svg+xml" tabindex="-1">Task Overdue Icon</object>
  <span class="task-dueDate ${
    taskDueDate ? "" : "elem-hide"
  }" data-app="taskDueDate">${
    taskDueDate ? d.formatDate(...taskDueDate) : ""
  }</span>
  <div class="task-label">
      <input class="task-nameInput ${
        taskName ? "elem-hide" : ""
      }" data-app="taskNameInput" type="text" placeholder="What would you like to do?">
      <span class="task-name ${
        taskName ? "" : "elem-hide"
      }" data-app="taskName">${taskName || "What would you like to do?"}</span>
      <span class="task-content ${taskContent ? "" : "elem-hide"}">${
    taskContent ? taskContent : ""
  }</span>
  </div>
</div>
<div class="task-note">
  <input class="task-textInput ${
    taskNote ? "elem-hide" : ""
  }" data-app="taskTextInput" type="text" placeholder="What would you like to keep in mind?" tabindex="-1">
  <span class="task-text ${taskNote ? "" : "elem-hide"}" data-app="taskText">${
    taskNote || "What would you like to keep in mind?"
  }</span>
</div>
<div class="task-btnFrame" data-app="taskBtnFrame">
  <button class="taskBtn" data-app="setTaskDateBtn" tabindex="-1">
      <div class="taskBtn-label">
          <object class="taskBtn-icon" data="icons/dateIcon.svg" type="text/svg+xml"
              tabindex="-1">Conf. Date Icon</object>
          <span class="taskBtn-text">Date</span>
      </div>
  </button>
  <button class="taskBtn" data-app="trashTaskBtn" tabindex="-1">
      <div class="taskBtn-label">
          <object class="taskBtn-icon" data="icons/trashIcon.svg" type="text/svg+xml"
              tabindex="-1">Delete Task Icon</object>
          <span class="taskBtn-text">Trash</span>
      </div>
  </button>
</div>
</div>
  `;

  return taskBtn;
}

export function upperHeaderHTML(content) {
  const headerBtnListMobile = `<div class="headerBtnList headerBtnList--mobile">
  <div class="headerBtn headerBtn--closeMainBtn" data-app="closeMainBtn">
      <object data="icons/arrowIcon.svg" type="text/svg+xml" tabindex="-1">Close Main Icon</object>
  </div>
  <div class="headerBtn headerBtn--settingsBtn ${
    content === "Inbox" || content === "Goal" ? "" : "elem-hide"
  }" data-app="headerSettingsBtn">
      <object data="icons/threeDotIcon.svg" type="text/svg+xml" tabindex="-1">Header Settings Icon</object>
  </div>
</div>`;
  return headerBtnListMobile;
}

export function headerInfoHTML(headerTitle, headerText, headerIcon, content) {
  const headerInfo = `<div class="header-info">
  <div class="header-label">
      <object class="header-icon ${headerIcon ? "" : "elem-hide"}" data="${
    headerIcon ? headerIcon : ""
  }"
          type="text/svg+xml" tabindex="-1"></object>
      <span class="header-title">
        ${headerTitle}
      </span>
      <div class="header-settingsBtn ${
        headerTitle === "Inbox" || content === "Goal" ? "" : "elem-hide"
      }" data-app="headerSettingsBtn" tabindex="0">
          <object data="icons/threeDotIcon.svg" type="text/svg+xml" tabindex="-1">Header Settings Icon</object>
      </div>
  </div>
  <div class="header-note">
      <span class="header-text ${
        headerText ? "" : "elem-hide"
      }" data-app="headerText">
          ${headerText ? headerText : ""}
      </span>
      <input class="header-textInput ${
        headerText ? "elem-hide" : ""
      }" type="text" placeholder="What is your goal all about?"
          data-app="headerTextInput">
  </div>
</div>`;
  return headerInfo;
}

export function lowerHeaderHTML(content) {
  const headerBtnList = `<div class="headerBtnList">
  <div class="headerBtnFrame" data-app="leftHeaderBtnFrame">
      <button class="headerBtn ${
        content === "Inbox" || content === "Goal" ? "" : "elem-hide"
      }" data-app="trashAllTasksBtn" tabindex="-1">
          <div class="headerBtn-label">
              <object class="headerBtn-icon" data="icons/trashIcon.svg" type="text/svg+xml"
                  tabindex="-1">Trash All Tasks Icon</object>
              <span class="headerBtn-text">Trash All</span>
          </div>
      </button>
      <button class="headerBtn ${
        content === "Inbox" || content === "Goal" ? "" : "elem-hide"
      }" data-app="toggleCheckAllTasksBtn" tabindex="-1">
          <div class="headerBtn-label">
              <span class="headerBtn-text">Mark / Unmark All</span>
          </div>
      </button>
      <button class="headerBtn ${
        content === "Inbox" || content === "Goal" ? "" : "elem-hide"
      }" data-app="clrCmpltdTasksBtn" tabindex="-1">
          <div class="headerBtn-label">
              <span class="headerBtn-text">Clear Complete</span>
          </div>
      </button>
  </div>
  <div class="headerBtnFrame" data-app="rightHeaderBtnFrame">
    <button class="headerBtn ${
      content === "Goal" ? "" : "elem-hide"
    }" data-app="deleteGoalBtn" tabindex="-1">
      <div class="headerBtn-label">
          <span class="headerBtn-text">Delete Goal</span>
      </div>
    </button>
  </div>
</div>`;
  return headerBtnList;
}

export function noTaskHTML(noTaskText) {
  const noTask = `<div class="noTask" data-app="noTask">
  <img class="noTask-img" src="icons/taskIcon.png" alt="Task app logo">
  <span class="noTask-text">${
    noTaskText ? noTaskText : "Whoops... looks like an error occured."
  }</span>
</div>`;
  return noTask;
}

export class LastVisitTemp {
  constructor() {
    this.data = this._read();
    this.propExists = (prop) => this.data.hasOwnProperty(prop);
  }

  getData(prop) {
    return this.data[`${prop}`];
  }
  updateData(prop, value) {
    this.data[`${prop}`] = value;
    this._save();
  }

  _read() {
    return JSON.parse(localStorage.getItem("data") || "{}");
  }
  _save() {
    localStorage.setItem("data", JSON.stringify(this.data));
  }
}
