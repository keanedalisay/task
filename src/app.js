import { delegateEvent, insertHTML, insertElem } from "./helpers.js";
import { setTabIndex, goalBtnHTML, taskBtnHTML } from "./helpers.js";
import {
  upperHeaderBtnListHTML,
  headerInfoHTML,
  bottomHeaderBtnListHTML,
} from "./helpers.js";

import { TodoTemp } from "./todo.js";
import { DateFnsTemp } from "./date.js";

const Todo = new TodoTemp();
const DateFns = new DateFnsTemp();

const App = {
  slctr: {
    overlay: document.querySelector("[data-app=overlay]"),
    dateModal: document.querySelector("[data-app=dateModal]"),
    header: document.querySelector("[data-app=header]"),

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
    goalBtnList: document.querySelector("[data-app=goalBtnList]"),
    taskBtnList: document.querySelector("[data-app=taskBtnList]"),

    monthInput: document.querySelector("[data-app=monthInput]"),
    dayInput: document.querySelector("[data-app=dayInput]"),
    yearInput: document.querySelector("[data-app=yearInput]"),

    saveDateBtn: document.querySelector("[data-app=saveDateBtn]"),
    cancelDateBtn: document.querySelector("[data-app=cancelDateBtn]"),
  },
  showOverlay() {
    App.slctr.overlay.classList.toggle("elem-hide");
    setTimeout((e) => App.slctr.overlay.classList.toggle("overlay-fade"), 1);
  },
  hideOverlay() {
    App.slctr.overlay.classList.toggle("overlay-fade");
    setTimeout((e) => App.slctr.overlay.classList.toggle("elem-hide"), 276);
  },
  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("accrd-collapse");
      return;
    }
  },
  toggleHeaderSettingsEvent() {
    App.slctr.header.classList.toggle("header-collapse");
    return;
  },
  trashAllTasksEvent() {
    const main = document.querySelector("main");
    const content = main.dataset.content;

    const goalId = main.dataset.goalid;
    const goal = Todo.getGoal(goalId);

    if (content === "Today" || content === "Upcoming") return;
    Todo.removeAllTasks(content, goalId);
    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else App.renderGoalTasks(goal);
    return;
  },
  toggleCheckAllTasks() {
    const main = document.querySelector("main");
    const content = main.dataset.content;

    const goalId = main.dataset.goalid;
    const goal = Todo.getGoal(goalId);

    if (content === "Today" || content === "Upcoming") return;
    Todo.toggleCompleteAllTasks(content, goalId);
    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else App.renderGoalTasks(goal);
  },
  toggleTaskSettingsEvent(e) {
    const task = e.target.closest(".task");
    task.classList.toggle("task-collapse");
    return;
  },
  createHeaderContent(content, goalTitle, goalText) {
    App.slctr.header.classList.add("header-collapse");
    App.slctr.header.innerHTML = "";
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

    insertHTML(App.slctr.header, upperHeaderBtnListHTML());
    insertHTML(
      App.slctr.header,
      headerInfoHTML(headerTitle, headerText, headerIcon)
    );
    insertHTML(App.slctr.header, bottomHeaderBtnListHTML());
    return;
  },
  renderContent(content) {
    content === "Inbox"
      ? App.slctr.inboxBtn.classList.add("button-select")
      : App.slctr.inboxBtn.classList.remove("button-select");
    content === "Today"
      ? App.slctr.todayBtn.classList.add("button-select")
      : App.slctr.todayBtn.classList.remove("button-select");
    content === "Upcoming"
      ? App.slctr.upcomingBtn.classList.add("button-select")
      : App.slctr.upcomingBtn.classList.remove("button-select");

    const goalBtns = document.querySelectorAll(".goalBtn");
    goalBtns.forEach((goalBtn) => goalBtn.classList.remove("button-select"));

    const main = document.querySelector("main");
    main.dataset.content = content;
    App.createHeaderContent(content);

    App.slctr.taskBtnList.innerHTML = "";
    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
  },
  renderGoalContent(e) {
    const goalBtn = e.target.closest(".goalBtn");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("button-select");
    App.slctr.todayBtn.classList.remove("button-select");
    App.slctr.upcomingBtn.classList.remove("button-select");

    goalBtn.classList.add("button-select");
    goalBtns.forEach((gBtn) => {
      if (gBtn !== goalBtn) gBtn.classList.remove("button-select");
    });

    const main = document.querySelector("main");
    main.dataset.content = "Goal";
    main.dataset.goalid = goalBtn.id;

    const goal = Todo.getGoal(goalBtn.id);
    App.createHeaderContent("Goal", goal.gName, goal.gNote);

    App.slctr.taskBtnList.innerHTML = "";
    App.renderGoalTasks(goal);
    return;
  },
  createGoalBtn() {
    const goalId = TodoTemp.gnrtGoalId();
    let goalBtn = goalBtnHTML(goalId, "");

    insertHTML(App.slctr.goalBtnList, goalBtn);

    goalBtn = document.getElementById(goalId);
    const goalBtnInput = goalBtn.querySelector("[data-app=goalBtnInput]");
    goalBtnInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!goalBtnInput.value.trim()) {
          App.slctr.goalBtnList.removeChild(goal);
          return;
        }
        Todo.createGoal({ name: goalBtnInput.value, id: goalId });
        App.renderGoalBtns(Todo.goals);
        return;
      } else if (e.key === "Escape") {
        App.slctr.goalList.removeChild(goal);
        return;
      }
    });
    return;
  },
  saveGoalNoteEvent(e) {
    const main = document.querySelector("main");
    const headerNote = document.querySelector("[data-app=headerText]");
    const headerNoteInput = document.querySelector(
      "[data-app=headerTextInput]"
    );
    const headerNoteValue = headerNoteInput.value;

    let origGoal = Todo.getGoal(main.dataset.goalid);

    if (e.key === "Enter") {
      if (!headerNoteValue.trim()) return;

      Todo.updateGoal({ ...origGoal, gNote: headerNoteValue });
      headerNoteInput.classList.add("elem-hide");
      headerNote.classList.remove("elem-hide");
      headerNote.textContent = headerNoteValue;

      return;
    }
  },
  createTaskBtn() {
    const main = document.querySelector("main");
    const content = main.dataset.content;
    const goalId = main.dataset.goalid;

    const taskId = TodoTemp.gnrtTaskId();
    const taskBtn = taskBtnHTML(taskId, "", "", "");
    insertHTML(App.slctr.taskBtnList, taskBtn);

    Todo.createTask({ name: "", id: taskId }, content, goalId);

    return;
  },
  checkTaskEvent(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

    const main = document.querySelector("main");
    const content = main.dataset.content;
    const goalId = main.dataset.goalid;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(goalId, taskBtn.id);

    let status = parseInt(checkboxIcon.dataset.status) ? false : true;

    Todo.updateTask(
      {
        ...origTask,
        completed: status,
      },
      content,
      goalId
    );

    content === "Inbox"
      ? App.renderInboxTasks(Todo.inbox)
      : App.renderGoalTasks(Todo.getGoal(goalId));

    return;
  },
  saveTaskNameEvent(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const taskNameInput = taskBtn.querySelector("[data-app=taskNameInput]");

    const main = document.querySelector("main");
    const content = main.dataset.content;
    const goalId = main.dataset.goalid;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(goalId, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNameInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tName: taskNameInput.value },
        content,
        goalId
      );

      content === "Inbox"
        ? App.renderInboxTasks(Todo.inbox)
        : App.renderGoalTasks(Todo.getGoal(goalId));

      return;
    }
  },
  saveTaskNoteEvent(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const taskNoteInput = taskBtn.querySelector("[data-app=taskTextInput]");

    const main = document.querySelector("main");
    const content = main.dataset.content;
    const goalId = main.dataset.goalid;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(goalId, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNoteInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tNote: taskNoteInput.value },
        content,
        goalId
      );

      content === "Inbox"
        ? App.renderInboxTasks(Todo.inbox)
        : App.renderGoalTasks(Todo.getGoal(goalId));

      return;
    }
  },
  showDateModal(e) {
    const task = e.target.closest(".task");
    App.slctr.dateModal.dataset.taskid = task.id;
    App.showOverlay();
    App.slctr.dateModal.classList.toggle("elem-hide");
    setTimeout((e) => App.slctr.dateModal.classList.toggle("modal-fade"), 1);
  },
  hideDateModal(e) {
    App.hideOverlay();
    App.slctr.dateModal.dataset.taskid = "";
    App.slctr.dateModal.classList.toggle("modal-fade");
    setTimeout((e) => App.slctr.dateModal.classList.toggle("elem-hide"), 276);
  },
  saveTaskDate() {
    const taskId = App.slctr.dateModal.dataset.taskid;
    const taskBtn = document.getElementById(taskId);

    const year = App.slctr.yearInput.value;
    const month = DateFns.parseMonthInt(App.slctr.monthInput.value);
    const day = App.slctr.dayInput.value;

    if (year < 0) return;
    else if (month === undefined) return;
    else if (day < 0 || day > 32) return;

    const main = document.querySelector("main");
    const content = main.dataset.content;
    const goalId = main.dataset.goalid;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    const date = DateFns.formatDate(year, month, day);

    Todo.updateTask({ ...origTask, tDueDate: date }, content, goalId);

    content === "Inbox"
      ? App.renderInboxTasks(Todo.inbox)
      : App.renderGoalTasks(Todo.getGoal(goalId));

    App.hideDateModal();
  },
  removeTaskEvent(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const main = document.querySelector("main");

    Todo.removeTask(taskBtn.id, main.dataset.content, main.dataset.goalid);
    taskBtn.remove();
  },

  renderGoalBtns(goals) {
    App.slctr.goalBtnList.innerHTML = "";
    if (goals.length === 0) return;
    goals.forEach((goal) => {
      const goalBtn = goalBtnHTML(goal.gId, goal.gName);
      insertHTML(App.slctr.goalBtnList, goalBtn);
    });
    document
      .querySelectorAll(".goalBtn")
      .forEach((goalBtn) =>
        goalBtn.addEventListener("click", App.renderGoalContent)
      );
  },
  renderInboxTasks(inbox) {
    App.slctr.taskBtnList.innerHTML = "";
    if (inbox.length === 0) return;
    inbox.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
    });
  },
  renderGoalTasks(goal) {
    App.slctr.taskBtnList.innerHTML = "";
    if (goal.tasks.length === 0) return;
    goal.tasks.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
    });
  },
  bindHeaderEvents() {
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=headerSettingsBtn]",
      App.toggleHeaderSettingsEvent
    );
    delegateEvent(
      App.slctr.header,
      "keyup",
      "[data-app=headerTextInput]",
      App.saveGoalNoteEvent
    );
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=trashAllTasksBtn]",
      App.trashAllTasksEvent
    );
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=toggleCheckAllTasksBtn]",
      App.toggleCheckAllTasks
    );
  },
  bindTaskEvents() {
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskInfo]",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskDueDate]",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskName]",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskContent]",
      App.toggleTaskSettingsEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskCheckbox]",
      App.checkTaskEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskNameInput]",
      App.saveTaskNameEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskTextInput]",
      App.saveTaskNoteEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=trashTaskBtn]",
      App.removeTaskEvent
    );
    delegateEvent(
      App.slctr.taskBtnList,
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

    App.bindHeaderEvents();
    App.bindTaskEvents();
    App.render();
  },
};

App.init();
