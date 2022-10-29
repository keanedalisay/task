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
    headerSettingsBtns: document.querySelectorAll(
      "[data-app=headerSettingsBtn]"
    ),
  },
  navToInbox() {
    const main = document.querySelector("main");
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.add("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

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
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.add("selected-btn");
    App.slctr.upcomingBtn.classList.remove("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

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
    const goalBtns = document.querySelectorAll(".goalBtn");

    App.slctr.inboxBtn.classList.remove("selected-btn");
    App.slctr.todayBtn.classList.remove("selected-btn");
    App.slctr.upcomingBtn.classList.add("selected-btn");

    goalBtns.forEach((gBtn) => gBtn.classList.remove("selected-btn"));

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

    main.dataset.tab = "Goal";
    main.dataset.goalid = goalBtn.id;
    App.slctr.headerInfoIcon.setAttribute("data", "../src/icons/checkIcon.svg");
    App.slctr.headerInfoTitle.textContent = goal.gName;
    App.slctr.headerInfoText.textContent = "This is your goal, have fun!";

    App.slctr.taskList.innerHTML = "";
    App.renderGoalTasks(goal);
    return;
  },
  createGoalBtn() {
    const goalBtn = document.createElement("button");

    goalBtn.id = TodoTemp.gnrtGoalId();
    goalBtn.classList.add("goalBtn");
    insertHTML(goalBtn, goalLabelHTML());
    insertElem(App.slctr.goalList, goalBtn);

    const goalInput = goalBtn.querySelector(".goalInput");
    const goalLabel = goalBtn.querySelector(".goalLabel");
    goalInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (!goalInput.value.trim()) {
          App.slctr.goalList.removeChild(goalBtn);
          return;
        }
        Todo.createGoal({ name: goalInput.value, id: goalBtn.id });

        goalBtn.addEventListener("click", App.navToGoal);
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

    Todo.createTask(
      { name: "", id: taskBtn.id },
      main.dataset.tab,
      main.dataset.goalid
    );
    return;
  },
  toggleHeaderSettings() {
    const header = document.querySelector(".header");
    header.classList.toggle("hide-headerSettings");
    return;
  },
  toggleTaskSettingsEvent(e) {
    const task = e.target.closest(".task");
    task.classList.toggle("hide-taskSettings");
    return;
  },
  checkTaskEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    const checkbox = taskBtn.querySelector(".checkbox");
    const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

    let origTask =
      main.dataset.tab === "Inbox"
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
      main.dataset.tab,
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
      main.dataset.tab === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNameInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tName: taskNameInput.value },
        main.dataset.tab,
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
      main.dataset.tab === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(main.dataset.goalid, taskBtn.id);

    if (e.key === "Enter") {
      if (!taskNoteInput.value.trim()) return;
      Todo.updateTask(
        { ...origTask, tNote: taskNoteInput.value },
        main.dataset.tab,
        main.dataset.goalid
      );
      taskNoteInput.classList.add("hide-elem");
      taskNote.classList.remove("hide-elem");
      taskNote.textContent = taskNoteInput.value;
    }
  },
  removeTaskEvent(e) {
    const taskBtn = e.target.closest(".task");
    const main = document.querySelector("main");

    Todo.removeTask(taskBtn.id, main.dataset.tab, main.dataset.goalId);
    taskBtn.remove();
  },
  renderGoalBtns(goals) {
    if (goals.length === 0) return;
    goals.forEach((goal) => {
      const goalBtn = document.createElement("button");

      goalBtn.classList.add("goalBtn");
      goalBtn.id = goal.gId;
      insertHTML(goalBtn, goalLabelHTML());

      goalBtn.addEventListener("click", App.navToGoal);
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
      const checkbox = taskBtn.querySelector(".checkbox");
      const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

      taskInfoFrame.setAttribute("tabindex", 0);
      taskNameInput.classList.add("hide-elem");
      taskName.classList.remove("hide-elem");

      task.tNote
        ? taskNoteInput.classList.add("hide-elem")
        : taskNoteInput.classList.remove("hide-elem");
      task.tNote
        ? taskNote.classList.remove("hide-elem")
        : taskNote.classList.add("hide-elem");

      taskName.textContent = task.tName;
      taskNote.textContent = task.tNote || "Edit Notes...";

      if (task.completed) {
        taskBtn.classList.toggle("completed-task");
        checkbox.classList.toggle("check-checkbox");
        checkboxIcon.setAttribute("data", "../src/icons/checkIcon.svg");
        checkboxIcon.dataset.status = 1;
      }

      insertElem(App.slctr.taskList, taskBtn);
    });
  },
  renderGoalTasks(goal) {
    if (goal.tasks.length === 0) return;
    goal.tasks.forEach((task) => {
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
      const checkbox = taskBtn.querySelector(".checkbox");
      const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

      taskInfoFrame.setAttribute("tabindex", 0);
      taskNameInput.classList.add("hide-elem");
      taskName.classList.remove("hide-elem");

      task.tNote
        ? taskNoteInput.classList.add("hide-elem")
        : taskNoteInput.classList.remove("hide-elem");
      task.tNote
        ? taskNote.classList.remove("hide-elem")
        : taskNote.classList.add("hide-elem");

      taskName.textContent = task.tName;
      taskNote.textContent = task.tNote || "Edit Notes...";

      if (task.completed) {
        taskBtn.classList.toggle("completed-task");
        checkbox.classList.toggle("check-checkbox");
        checkboxIcon.setAttribute("data", "../src/icons/checkIcon.svg");
        checkboxIcon.dataset.status = 1;
      }

      insertElem(App.slctr.taskList, taskBtn);
    });
  },
  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("hide-accrd");
      return;
    }
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

    App.bindTaskEvents();
    App.render();
  },
};

App.init();
