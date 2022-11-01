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
  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("hide-accrd");
      return;
    }
  },
  toggleHeaderSettings() {
    const header = document.querySelector("[data-app=header]");
    header.classList.toggle("hide-headerSettings");
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
    header.classList.add("hide-headerSettings");
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

    App.slctr.taskBtnList.innerHTML = "";
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
      headerNoteInput.classList.add("hide-elem");
      headerNote.classList.remove("hide-elem");
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

    let status = parseInt(checkboxIcon.dataset.status) ? 0 : 1;

    Todo.updateTask(
      {
        ...origTask,
        completed: Boolean(status),
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
  saveTaskDate() {
    const taskId = App.slctr.dateModal.dataset.taskid;
    const taskBtn = document.getElementById(taskId);

    const year = parseInt(App.slctr.yearInput.value);
    const month = DateFns.parseMonthInt(App.slctr.monthInput.value);
    const day = parseInt(App.slctr.dayInput.value);

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

    delegateEvent(
      document.querySelector("[data-app=header]"),
      "click",
      "[data-app=headerSettingsBtn]",
      App.toggleHeaderSettings
    );
    delegateEvent(
      document.querySelector("[data-app=header]"),
      "keyup",
      "[data-app=headerTextInput]",
      App.saveGoalNoteEvent
    );

    App.bindTaskEvents();
    App.render();
  },
};

App.init();
