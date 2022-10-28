import {
  delegateEvent,
  insertHTML,
  insertElem,
  setTabIndex,
  goalLabelHTML,
  taskLabelHTML,
} from "./helpers.js";
import { TodoTemp } from "./todo.js";

const Todo = new TodoTemp();

const App = {
  slctr: {
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
    goalList: document.querySelector("[data-app=goalList]"),
    taskList: document.querySelector(".taskList"),

    headerInfoIcon: document.querySelector("[data-app=headerInfoIcon]"),
    headerInfoTitle: document.querySelector("[data-app=headerInfoTitle]"),
    headerInfoText: document.querySelector("[data-app=headerInfoText]"),
  },
  navToInbox() {
    const main = document.querySelector("main");

    App.slctr.inboxBtn.classList.add("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    main.dataset.tab = "Inbox";
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

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.add("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    main.dataset.tab = "Today";
    App.slctr.headerInfoIcon.setAttribute("data", "../src/icons/starIcon.svg");
    App.slctr.headerInfoTitle.textContent = "Today";
    App.slctr.headerInfoText.textContent =
      "All tasks for you to complete today, have a great day!";

    App.slctr.taskList.innerHTML = "";
    return;
  },
  navToUpcoming() {
    const main = document.querySelector("main");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.add("selected-btn");

    main.dataset.tab = "Upcoming";
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
  createGoalBtn() {
    const goalBtn = document.createElement("button");
    goalBtn.classList.add("goalBtn");
    goalBtn.id = TodoTemp.gnrtGoalId();
    insertHTML(goalBtn, goalLabelHTML());
    insertElem(App.slctr.goalList, goalBtn);

    const goalInput = goalBtn.querySelector(`.goalInput`);
    const goalLabel = goalBtn.querySelector(`.goalLabel`);
    goalInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!goalInput.value.trim()) {
          App.slctr.goalList.removeChild(goalBtn);
          return;
        }
        Todo.createGoal(goalInput.value, goalBtn.id);
        goalInput.classList.add("hide-elem");
        goalLabel.classList.remove("hide-elem");
        goalLabel.textContent = goalInput.value;
        return;
      } else if (e.key === "Escape") {
        App.slctr.goalList.removeChild(goalBtn);
        return;
      }
    });
    return;
  },
  createTaskBtn() {
    const main = document.querySelector("main");
    const taskBtn = document.createElement("div");

    taskBtn.id = TodoTemp.gnrtTaskId();
    taskBtn.classList.add("task");
    taskBtn.classList.add("hide-taskSettings");
    insertHTML(taskBtn, taskLabelHTML());
    insertElem(App.slctr.taskList, taskBtn);

    const taskInfoFrame = taskBtn.querySelector(".task-infoFrame");
    taskInfoFrame.setAttribute("tabindex", 0);

    Todo.createTask("", taskBtn.id, main.dataset.tab, main.dataset.goalId);

    App.toggleTaskSettingsEvent(taskBtn);
    App.saveTaskNameEvent(taskBtn);
    App.saveTaskNoteEvent(taskBtn);
    return;
  },
  toggleTaskSettingsEvent(task) {
    const taskCheckbox = task.querySelector(".checkbox");
    const taskInfoFrame = task.querySelector(".task-infoFrame");
    const taskNameInput = task.querySelector(".task-nameInput");

    taskInfoFrame.addEventListener("click", (e) => {
      if (e.target === taskNameInput || e.target === taskCheckbox) return;
      task.classList.toggle("hide-taskSettings");
      return;
    });
  },
  saveTaskNameEvent(task) {
    const main = document.querySelector("main");

    const taskNameInput = task.querySelector(".task-nameInput");
    const taskName = task.querySelector(".task-name");

    taskNameInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!taskNameInput.value.trim()) {
          App.slctr.taskList.removeChild(task);
          return;
        }
        Todo.updateTaskName(
          taskNameInput.value,
          main.dataset.tab,
          task.id,
          main.dataset.goalId
        );
        taskNameInput.classList.add("hide-elem");
        taskName.classList.remove("hide-elem");
        taskName.textContent = taskNameInput.value;
        return;
      }
    });
  },
  saveTaskNoteEvent(task) {
    const main = document.querySelector("main");

    const taskNoteInput = task.querySelector(".task-noteInput");
    const taskNote = task.querySelector(".task-note");

    taskNoteInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!taskNoteInput.value.trim()) return;
        Todo.updateTaskNote(
          taskNoteInput.value,
          main.dataset.tab,
          task.id,
          main.dataset.goalId
        );
        taskNoteInput.classList.add("hide-elem");
        taskNote.classList.remove("hide-elem");
        taskNote.textContent = taskNoteInput.value;
      }
    });
  },
  renderGoalBtns(goals) {
    if (goals.length === 0) return;
    goals.forEach((goal) => {
      const goalBtn = document.createElement("button");
      goalBtn.classList.add("goalBtn");
      goalBtn.id = goal.gId;
      insertHTML(goalBtn, goalLabelHTML());

      goalBtn.querySelector(`.goalInput`).classList.add("hide-elem");
      goalBtn.querySelector(`.goalLabel`).classList.remove("hide-elem");
      goalBtn.querySelector(`.goalLabel`).textContent = goal.gName;
      insertElem(App.slctr.goalList, goalBtn);
    });
  },
  renderInboxTasks(inbox) {
    if (inbox.length === 0) return;
    inbox.forEach((task) => {
      const taskBtn = document.createElement("div");
      taskBtn.classList.add("task");
      taskBtn.classList.add("hide-taskSettings");
      taskBtn.id = task.tId;
      insertHTML(taskBtn, taskLabelHTML());
      insertElem(App.slctr.taskList, taskBtn);

      const taskInfoFrame = taskBtn.querySelector(".task-infoFrame");
      const taskNameInput = taskBtn.querySelector(".task-nameInput");
      const taskName = taskBtn.querySelector(".task-name");
      const taskNoteInput = taskBtn.querySelector(".task-noteInput");
      const taskNote = taskBtn.querySelector(".task-note");

      taskInfoFrame.setAttribute("tabindex", 0);
      taskNameInput.classList.add("hide-elem");
      taskName.classList.remove("hide-elem");
      taskNoteInput.classList.add("hide-elem");
      taskNote.classList.remove("hide-elem");

      taskName.textContent = task.tName;
      taskNote.textContent = task.tNote;
      App.toggleTaskSettingsEvent(taskBtn);

      insertElem(App.slctr.taskList, taskBtn);
    });
  },
  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("hide-accrd");
      return;
    }
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
    App.render();
  },
};

App.init();
