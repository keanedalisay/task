import {
  delegateEvent,
  insertHTML,
  insertElem,
  setTabIndex,
  goalBtnHTML,
  taskBtnHTML,
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
    goalList: document.querySelector(".goalList"),
    taskList: document.querySelector(".taskList"),

    headerInfoIcon: document.querySelector("[data-app=headerInfoIcon]"),

    headerInfoTitle: document.querySelector("[data-app=headerInfoTitle]"),
    headerInfoTitleInput: document.querySelector(
      "[data-app=headerInfoTitleInput]"
    ),

    headerInfoText: document.querySelector("[data-app=headerNoteText]"),
    headerInfoTextInput: document.querySelector(
      "[data-app=headerNoteTextInput]"
    ),
    headerSettingsBtns: document.querySelectorAll(
      "[data-app=headerSettingsBtn]"
    ),

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
    console.log(task);
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
  navToInbox() {
    const main = document.querySelector("main");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.add("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

    main.dataset.content = "Inbox";
    App.slctr.headerInfoIcon.classList.remove("hide-elem");
    App.slctr.headerInfoIcon.setAttribute("data", "../src/icons/inboxIcon.svg");
    App.slctr.headerInfoTitle.textContent = "Inbox";
    App.slctr.headerInfoText.textContent =
      "This is where your independent tasks are stored. Feel free to add as many as you like!";

    App.slctr.taskList.innerHTML = "";
    App.renderInboxTasks(Todo.inbox);
    return;
  },
  navToToday() {
    const main = document.querySelector("main");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.add("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

    main.dataset.content = "Today";
    App.slctr.headerInfoIcon.classList.remove("hide-elem");
    App.slctr.headerInfoIcon.setAttribute("data", "../src/icons/starIcon.svg");
    App.slctr.headerInfoTitle.textContent = "Today";
    App.slctr.headerInfoText.textContent =
      "All tasks for you to complete today, have a great day!";

    App.slctr.taskList.innerHTML = "";
    return;
  },
  navToUpcoming() {
    const main = document.querySelector("main");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.add("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

    main.dataset.content = "Upcoming";
    App.slctr.headerInfoIcon.classList.remove("hide-elem");
    App.slctr.headerInfoIcon.setAttribute(
      "data",
      "../src/icons/upcomingIcon.svg"
    );
    App.slctr.headerInfoTitle.textContent = "Upcoming";
    App.slctr.headerInfoText.textContent =
      "Upcoming tasks for you to do, including those that are overdue. You can do this!";

    App.slctr.taskList.innerHTML = "";
    return;
  },
  navToGoal(e) {
    const goalBtn = e.target.closest(".goalBtn");
    const goalBtns = document.querySelectorAll(".goalBtn");
    const goal = Todo.getGoal(goalBtn.id);
    const main = document.querySelector("main");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtn.classList.add("selected-btn");
    goalBtns.forEach((gBtn) => {
      if (gBtn !== goalBtn) gBtn.classList.remove("selected-btn");
    });

    main.dataset.content = "Goal";
    main.dataset.goalid = goalBtn.id;
    App.slctr.headerInfoIcon.classList.add("hide-elem");
    App.slctr.headerInfoTitle.textContent = goal.gName;
    App.slctr.headerInfoTitleInput.value = goal.gName;
    App.slctr.headerInfoText.textContent =
      goal.gNote || "What is your goal all about?";
    App.slctr.headerInfoTextInput.value = goal.gNote;

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
    const taskInfoFrame = taskBtn.querySelector(".task-infoFrame");
    const taskNameFrame = taskBtn.querySelector(".task-nameFrame");

    console.log(taskId);
    const year = parseInt(App.slctr.yearInput.value);
    const month = D.parseMonthInt(App.slctr.monthInput.value);
    const day = parseInt(App.slctr.dayInput.value);

    console.log(month);

    let origTask =
      main.dataset.content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    const date = D.formatDate(year, month, day);
    const span = document.createElement("span");
    span.classList.add("task-dueDate");
    span.textContent = date;
    console.log(span);
    Todo.updateTask(
      { ...origTask, tDueDate: date },
      main.dataset.content,
      main.dataset.goalid
    );
    taskInfoFrame.insertBefore(span, taskNameFrame);
    App.hideDateModal();
  },
  removeTaskEvent(e) {
    const taskBtn = e.target.closest(".task");
    console.log(taskBtn);
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
      .forEach((goalBtn) => goalBtn.addEventListener("click", App.navToGoal));
  },
  renderInboxTasks(inbox) {
    if (inbox.length === 0) return;
    inbox.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
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
    App.slctr.inboxBtn.addEventListener("click", App.navToInbox);
    App.slctr.todayBtn.addEventListener("click", App.navToToday);
    App.slctr.upcomingBtn.addEventListener("click", App.navToUpcoming);

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
    App.slctr.headerSettingsBtns.forEach((btn) =>
      btn.addEventListener("click", App.toggleHeaderSettings)
    );

    App.slctr.overlay.addEventListener("click", App.hideDateModal);
    App.slctr.saveDateBtn.addEventListener("click", App.saveTaskDate);
    App.slctr.cancelDateBtn.addEventListener("click", App.hideDateModal);

    App.bindGoalEvents();
    App.bindTaskEvents();
    App.render();
  },
};

App.init();
