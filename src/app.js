import { delegateEvent, insertHTML, insertElem } from "./helpers.js";
import { setTabIndex, goalBtnHTML, taskBtnHTML } from "./helpers.js";
import {
  upperHeaderBtnListHTML,
  headerInfoHTML,
  bottomHeaderBtnListHTML,
} from "./helpers.js";

import { TodoTemp } from "./todo.js";
import { DateTemp } from "./date.js";

const Todo = new TodoTemp();
const D = new DateTemp();

const App = {
  slctr: {
    overlay: document.querySelector("[data-app=overlay]"),
    dateModal: document.querySelector("[data-app=dateModal]"),

    inboxBtn: document.querySelector("[data-app=inboxBtn]"),
    todayBtn: document.querySelector("[data-app=todayBtn]"),
    upcomingBtn: document.querySelector("[data-app=upcomingBtn]"),

    settingsBtn: document.querySelector("[data-app=settingsBtn]"),

    newBtn: document.querySelector("[data-app=newBtn]"),
    newGoalBtn: document.querySelector("[data-app=newGoalBtn]"),
    newTaskBtns: document.querySelectorAll("[data-app=newTaskBtn]"),

    accrdSettings: document.querySelector("[data-app=accrdSettings]"),
    accrdSettingsBtns: document.querySelectorAll(
      "[data-app=accrdSettings] > .accrdBtn"
    ),
    accrdNew: document.querySelector("[data-app=accrdNew]"),
    accrdNewBtns: document.querySelectorAll("[data-app=accrdNew] > .accrdBtn"),

    navBtnList: document.querySelector("[data-app=navBtnList]"),
    goalList: document.querySelector("[data-app=goalBtnList]"),
    taskList: document.querySelector("[data-app=taskBtnList]"),

    monthInput: document.querySelector("[data-app=monthInput]"),
    dayInput: document.querySelector("[data-app=dayInput]"),
    yearInput: document.querySelector("[data-app=yearInput]"),

    saveDateBtn: document.querySelector("[data-app=saveDateBtn]"),
    cancelDateBtn: document.querySelector("[data-app=cancelDateBtn]"),
  },
  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("hide-accrd");
      return;
    }
  },
  toggleHeaderSettings() {
    const main = document.querySelector("main");
    const header = document.querySelector(".header");
    header.classList.toggle("hide-headerSettings");

    if (main.dataset.content === "Goal") {
      App.slctr.headerInfoTitle.classList.toggle("hide-elem");
      App.slctr.headerInfoText.classList.toggle("hide-elem");

      App.slctr.headerInfoTitleInput.classList.toggle("hide-elem");
      App.slctr.headerInfoTextInput.classList.toggle("hide-elem");
    }
    return;
  },
  toggleTaskSettingsEvent(e) {
    const task = e.target.closest(".task");
    task.classList.toggle("hide-taskSettings");
    return;
  },
  showOverlay() {
    App.slctr.overlay.classList.toggle("display-none");
    setTimeout((e) => App.slctr.overlay.classList.toggle("hide-overlay"), 1);
  },
  hideOverlay() {
    App.slctr.overlay.classList.toggle("hide-overlay");
    setTimeout((e) => App.slctr.overlay.classList.toggle("display-none"), 276);
  },
  showDateModal(e) {
    const task = e.target.closest(".task");
    App.slctr.dateModal.dataset.taskid = task.id;
    App.showOverlay();
    App.slctr.dateModal.classList.toggle("display-none");
    setTimeout((e) => App.slctr.dateModal.classList.toggle("hide-modal"), 1);
  },
  hideDateModal(e) {
    App.hideOverlay();
    App.slctr.dateModal.dataset.taskid = "";
    App.slctr.dateModal.classList.toggle("hide-modal");
    setTimeout(
      (e) => App.slctr.dateModal.classList.toggle("display-none"),
      276
    );
  },
  createHeaderContent(content, goalTitle, goalText) {
    const header = document.querySelector("[data-app=header]");
    header.innerHTML = "";
    let headerTitle = content;
    let headerText = "";
    let headerIcon = "";

    switch (headerTitle) {
      case "Inbox":
        headerText =
          "This is where your independent tasks are stored. Feel free to add as many as you like!";
        headerIcon = "../src/icons/inboxIcon.svg";
        break;
      case "Today":
        headerText = "All tasks for you to complete today, have a great day!";
        headerIcon = "../src/icons/starIcon.svg";
        break;
      case "Upcoming":
        headerText =
          "Upcoming tasks for you to do, including those that are overdue. You can do this!";
        headerIcon = "../src/icons/upcomingIcon.svg";
        break;
      case "Goal":
        headerTitle = goalTitle;
        headerText = goalText;
    }

    insertHTML(header, upperHeaderBtnListHTML());
    insertHTML(header, headerInfoHTML(headerTitle, headerText, headerIcon));
    insertHTML(header, bottomHeaderBtnListHTML());
    return;
  },
  renderContent(content) {
    content === "Inbox"
      ? App.slctr.inboxBtn.classList.add("selected-btn")
      : App.slctr.inboxBtn.classList.remove("selected-btn");
    content === "Today"
      ? App.slctr.todayBtn.classList.add("selected-btn")
      : App.slctr.todayBtn.classList.remove("selected-btn");
    content === "Upcoming"
      ? App.slctr.upcomingBtn.classList.add("selected-btn")
      : App.slctr.upcomingBtn.classList.remove("selected-btn");

    const goalBtns = document.querySelectorAll(".goalBtn");
    goalBtns.forEach((goalBtn) => goalBtn.classList.remove("selected-btn"));

    const main = document.querySelector("main");
    main.dataset.content = content;
    App.createHeaderContent(content);

    App.slctr.taskList.innerHTML = "";
    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
  },
  renderGoalContent(e) {
    const goalBtn = e.target.closest(".goalBtn");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtn.classList.add("selected-btn");
    goalBtns.forEach((gBtn) => {
      if (gBtn !== goalBtn) gBtn.classList.remove("selected-btn");
    });

    const main = document.querySelector("main");
    main.dataset.content = "Goal";
    main.dataset.goalid = goalBtn.id;

    const goal = Todo.getGoal(goalBtn.id);
    App.createHeaderContent("Goal", goal.gName, goal.gNote);

    App.slctr.taskList.innerHTML = "";
    App.renderGoalTasks(goal);
    return;
  },
  createGoalBtn() {
    const goalId = TodoTemp.gnrtGoalId();
    const goalBtn = goalBtnHTML(goalId, "");

    insertHTML(App.slctr.goalList, goalBtn);

    const goal = document.getElementById(goalId);
    const goalInput = goal.querySelector(".goalInput");
    const goalLabel = goal.querySelector(".goalLabel");
    goalInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!goalInput.value.trim()) {
          App.slctr.goalList.removeChild(goal);
          return;
        }
        Todo.createGoal({ name: goalInput.value, id: goalId });

        goal.addEventListener("click", App.navToGoal);
        goalInput.classList.add("hide-elem");
        goalLabel.classList.remove("hide-elem");
        goalLabel.textContent = goalInput.value;
        return;
      } else if (e.key === "Escape") {
        App.slctr.goalList.removeChild(goal);
        return;
      }
    });
    return;
  },
  saveGoalNameEvent(e) {
    const main = document.querySelector("main");
    const goalBtn = document.getElementById(main.dataset.goalid);

    let origGoal = Todo.getGoal(main.dataset.goalid);
    const headerTitleInput = App.slctr.headerInfoTitleInput.value;

    if (e.key === "Enter") {
      if (!headerTitleInput.trim()) return;

      Todo.updateGoal({ ...origGoal, gName: headerTitleInput });
      App.slctr.headerInfoTitleInput.blur();
      App.slctr.headerInfoTitle.textContent = headerTitleInput;
      goalBtn.querySelector(".goalLabel").textContent = headerTitleInput;

      return;
    }
  },
  saveGoalNoteEvent(e) {
    const main = document.querySelector("main");

    let origGoal = Todo.getGoal(main.dataset.goalid);
    const headerNoteInput = App.slctr.headerInfoTextInput.value;

    if (e.key === "Enter") {
      if (!headerNoteInput.trim()) return;

      Todo.updateGoal({ ...origGoal, gNote: headerNoteInput });
      App.slctr.headerInfoTextInput.blur();
      App.slctr.headerInfoText.textContent = headerNoteInput;

      return;
    }
  },
  createTaskBtn() {
    const main = document.querySelector("main");

    const taskId = TodoTemp.gnrtTaskId();
    const taskBtn = taskBtnHTML(taskId, "", "", "");
    insertHTML(App.slctr.taskList, taskBtn);

    Todo.createTask(
      { name: "", id: taskId },
      main.dataset.content,
      main.dataset.goalid
    );
    return;
  },
  checkTaskEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    const checkbox = taskBtn.querySelector(".checkbox");
    const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

    let origTask =
      main.dataset.content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);
    let status = parseInt(checkboxIcon.dataset.status);

    taskBtn.classList.toggle("completed-task");
    checkbox.classList.toggle("check-checkbox");
    checkboxIcon.setAttribute(
      "data",
      status ? "" : "../src/icons/checkIcon.svg"
    );
    status = checkboxIcon.dataset.status = status ? 0 : 1;

    Todo.updateTask(
      {
        ...origTask,
        completed: Boolean(status),
      },
      main.dataset.content,
      main.dataset.goalid
    );
    return;
  },
  saveTaskNameEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    const taskNameInput = taskBtn.querySelector(".task-nameInput");
    const taskName = taskBtn.querySelector(".task-name");

    let origTask =
      main.dataset.content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNameInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tName: taskNameInput.value },
        main.dataset.content,
        main.dataset.goalid
      );
      taskNameInput.classList.add("hide-elem");
      taskName.classList.remove("hide-elem");
      taskName.textContent = taskNameInput.value;
      return;
    }
  },
  saveTaskNoteEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    const taskNoteInput = taskBtn.querySelector(".task-noteInput");
    const taskNote = taskBtn.querySelector(".task-note");

    let origTask =
      main.dataset.content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNoteInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tNote: taskNoteInput.value },
        main.dataset.content,
        main.dataset.goalid
      );
      taskNoteInput.classList.add("hide-elem");
      taskNote.classList.remove("hide-elem");
      taskNote.textContent = taskNoteInput.value;
    }
  },
  saveTaskDate() {
    const main = document.querySelector("main");
    const taskId = App.slctr.dateModal.dataset.taskid;
    const taskBtn = document.getElementById(taskId);
    const taskDueDateLbl = taskBtn.querySelector(".task-dueDate");

    const year = parseInt(App.slctr.yearInput.value);
    const month = D.parseMonthInt(App.slctr.monthInput.value);
    const day = parseInt(App.slctr.dayInput.value);

    let origTask =
      main.dataset.content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    const date = D.formatDate(year, month, day);
    taskDueDateLbl.textContent = date;
    taskDueDateLbl.classList.remove("hide-elem");

    Todo.updateTask(
      { ...origTask, tDueDate: date },
      main.dataset.content,
      main.dataset.goalid
    );

    App.hideDateModal();
  },
  removeTaskEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    Todo.removeTask(taskBtn.id, main.dataset.content, main.dataset.goalid);
    taskBtn.remove();
  },

  renderGoalBtns(goals) {
    if (goals.length === 0) return;
    goals.forEach((goal) => {
      const goalBtn = goalBtnHTML(goal.gId, goal.gName);
      insertHTML(App.slctr.goalList, goalBtn);
    });
    document
      .querySelectorAll(".goalBtn")
      .forEach((goalBtn) =>
        goalBtn.addEventListener("click", App.renderGoalContent)
      );
  },
  renderInboxTasks(inbox) {
    if (inbox.length === 0) return;
    inbox.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskList, taskBtn);
    });
  },
  renderGoalTasks(goal) {
    if (goal.tasks.length === 0) return;
    goal.tasks.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskList, taskBtn);
    });
  },
  bindGoalEvents() {
    delegateEvent(
      document.querySelector(".header"),
      "keyup",
      "[data-app=headerInfoTitleInput]",
      App.saveGoalNameEvent
    );
    delegateEvent(
      document.querySelector(".header"),
      "keyup",
      "[data-app=headerNoteTextInput]",
      App.saveGoalNoteEvent
    );
  },
  bindTaskEvents() {
    delegateEvent(
      App.slctr.taskList,
      "click",
      ".task-infoFrame",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskList,
      "click",
      ".task-name",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskList,
      "click",
      ".task-tabName",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(App.slctr.taskList, "click", ".checkbox", App.checkTaskEvent);
    delegateEvent(
      App.slctr.taskList,
      "keyup",
      ".task-nameInput",
      App.saveTaskNameEvent
    );
    delegateEvent(
      App.slctr.taskList,
      "keyup",
      ".task-noteInput",
      App.saveTaskNoteEvent
    );
    delegateEvent(
      App.slctr.taskList,
      "click",
      "[data-app=trashTaskBtn]",
      App.removeTaskEvent
    );
    delegateEvent(
      App.slctr.taskList,
      "click",
      "[data-app=setTaskDateBtn]",
      App.showDateModal
    );
  },
  render() {
    App.renderGoalBtns(Todo.goals);
  },
  init() {
    App.slctr.inboxBtn.addEventListener("click", (e) =>
      App.renderContent("Inbox")
    );
    App.slctr.todayBtn.addEventListener("click", (e) =>
      App.renderContent("Today")
    );
    App.slctr.upcomingBtn.addEventListener("click", (e) =>
      App.renderContent("Upcoming")
    );

    App.slctr.settingsBtn.addEventListener("click", (e) => {
      App.toggleAccrd(e, App.slctr.accrdSettings);
      setTabIndex(App.slctr.accrdSettingsBtns);
    });
    App.slctr.newBtn.addEventListener("click", (e) => {
      App.toggleAccrd(e, App.slctr.accrdNew);
      setTabIndex(App.slctr.accrdNewBtns);
    });

    App.slctr.newGoalBtn.addEventListener("click", App.createGoalBtn);
    App.slctr.newTaskBtns.forEach((newTaskBtn) => {
      newTaskBtn.addEventListener("click", App.createTaskBtn);
    });

    App.slctr.overlay.addEventListener("click", App.hideDateModal);
    App.slctr.saveDateBtn.addEventListener("click", App.saveTaskDate);
    App.slctr.cancelDateBtn.addEventListener("click", App.hideDateModal);

    App.bindGoalEvents();
    App.bindTaskEvents();
    App.render();
  },
};

App.init();
