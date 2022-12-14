import { delegateEvent, insertHTML } from "./helpers.js";
import { setTabIndex, goalBtnHTML, taskBtnHTML } from "./helpers.js";
import { upperHeaderHTML, headerInfoHTML, lowerHeaderHTML } from "./helpers.js";
import { getDueTaskCount } from "./helpers.js";
import { noTaskHTML } from "./helpers.js";

import { TodoTemp } from "./todo.js";
import { LastVisitTemp } from "./helpers.js";
import { dTemp } from "./date.js";

const Todo = new TodoTemp();
const LastVisit = new LastVisitTemp();
const d = new dTemp();

const App = {
  slctr: {
    introSplshScrn: document.querySelector("[data-app=introSplshScrn]"),
    overlay: document.querySelector("[data-app=overlay]"),
    html: document.querySelector("html"),
    main: document.querySelector("main"),
    header: document.querySelector("[data-app=header]"),

    inboxBtn: document.querySelector("[data-app=inboxBtn]"),
    inboxDueTaskCnt: document.querySelector("[data-app=inboxDueTaskCnt]"),
    inboxTaskCnt: document.querySelector("[data-app=inboxTaskCnt]"),

    todayBtn: document.querySelector("[data-app=todayBtn]"),
    todayTaskCnt: document.querySelector("[data-app=todayTaskCnt]"),

    upcomingBtn: document.querySelector("[data-app=upcomingBtn]"),
    upcomingDueTaskCnt: document.querySelector("[data-app=upcomingDueTaskCnt]"),
    upcomingTaskCnt: document.querySelector("[data-app=upcomingTaskCnt]"),

    settingsBtn: document.querySelector("[data-app=settingsBtn]"),
    accrdSettings: document.querySelector("[data-app=accrdSettings]"),
    accrdSettingsBtns: document.querySelectorAll(
      "[data-app=accrdSettings] > .accrdBtn"
    ),
    lightModeBtn: document.querySelector("[data-app=lightModeBtn]"),
    darkModeBtn: document.querySelector("[data-app=darkModeBtn]"),

    newBtn: document.querySelector("[data-app=newBtn]"),
    accrdNew: document.querySelector("[data-app=accrdNew]"),
    accrdNewBtns: document.querySelectorAll("[data-app=accrdNew] > .accrdBtn"),
    newGoalBtn: document.querySelector("[data-app=newGoalBtn]"),
    newTaskBtns: document.querySelectorAll("[data-app=newTaskBtn]"),

    navBtnList: document.querySelector("[data-app=navBtnList]"),
    goalBtnList: document.querySelector("[data-app=goalBtnList]"),
    taskBtnList: document.querySelector("[data-app=taskBtnList]"),

    dateModal: document.querySelector("[data-app=dateModal]"),
    monthInput: document.querySelector("[data-app=monthInput]"),
    dayInput: document.querySelector("[data-app=dayInput]"),
    yearInput: document.querySelector("[data-app=yearInput]"),
    saveDateBtn: document.querySelector("[data-app=saveDateBtn]"),
    cancelDateBtn: document.querySelector("[data-app=cancelDateBtn]"),

    deleteGoalModal: document.querySelector("[data-app=deleteGoalModal]"),
    deleteGoalYesBtn: document.querySelector("[data-app=deleteGoalYesBtn]"),
    deleteGoalNoBtn: document.querySelector("[data-app=deleteGoalNoBtn]"),
  },

  showOverlay() {
    App.slctr.overlay.classList.toggle("elem-hide");
    setTimeout(() => App.slctr.overlay.classList.toggle("overlay-fade"), 1);
    return;
  },
  hideOverlay() {
    App.slctr.overlay.classList.toggle("overlay-fade");
    setTimeout(() => App.slctr.overlay.classList.toggle("elem-hide"), 276);
    return;
  },
  hideModal() {
    App.hideOverlay();
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.add("modal-fade");
      setTimeout(() => modal.classList.add("elem-hide"), 276);
    });
    return;
  },

  toggleAccrd(e, elem) {
    if (e.target) {
      elem.classList.toggle("accrd-collapse");
      const accrdArrow = e.target.querySelector("[data-app=accrdArrow]");
      accrdArrow.classList.toggle("accrdArrow-flip");
      return;
    }
  },
  toggleMain() {
    document.body.classList.toggle("body-showScroll");
    document.querySelector(".addTaskBtn").classList.toggle("addTaskBtn-show");
    App.slctr.main.classList.toggle("main-slideRight");
  },

  toggleLightMode() {
    App.slctr.html.dataset.dark = "false";
    const accrdArrow = document.querySelectorAll("[data-app=accrdArrow]");
    accrdArrow.forEach((arrow) =>
      arrow.setAttribute("data", "icons/arrowIcon.svg")
    );

    LastVisit.updateData("isDark", false);
    return;
  },
  toggleDarkMode() {
    App.slctr.html.dataset.dark = "true";
    const accrdArrow = document.querySelectorAll("[data-app=accrdArrow]");
    accrdArrow.forEach((arrow) =>
      arrow.setAttribute("data", "icons/arrowIcon-dark.svg")
    );

    LastVisit.updateData("isDark", true);
    return;
  },

  toggleHeaderSettings(e) {
    const leftHeaderBtns = document.querySelectorAll(
      "[data-app=leftHeaderBtnFrame] > .headerBtn"
    );
    const rightHeaderBtns = document.querySelector(
      "[data-app=rightHeaderBtnFrame] > .headerBtn"
    );
    if (e.which === 1 || e.key === "Enter" || e.key === " ") {
      App.slctr.header.classList.toggle("header-collapse");
      setTabIndex(leftHeaderBtns);
      setTabIndex(rightHeaderBtns);
      return;
    }
  },
  trashAllTasks() {
    const content = App.slctr.main.dataset.content;

    const goalId = App.slctr.main.dataset.goalid;
    const goal = Todo.getGoal(goalId);

    if (content === "Today" || content === "Upcoming") return;

    Todo.removeAllTasks(content, goalId);
    App.render();

    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else App.renderGoalTasks(goal);
    return;
  },
  toggleCheckAllTasks() {
    const content = App.slctr.main.dataset.content;

    const goalId = App.slctr.main.dataset.goalid;
    const goal = Todo.getGoal(goalId);

    if (content === "Today" || content === "Upcoming") return;

    Todo.toggleCompleteAllTasks(content, goalId);

    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else App.renderGoalTasks(goal);
    return;
  },
  clearCompletedTasks() {
    const content = App.slctr.main.dataset.content;

    const goalId = App.slctr.main.dataset.goalid;
    const goal = Todo.getGoal(goalId);

    if (content === "Today" || content === "Upcoming") return;

    Todo.removeCompletedTasks(content, goalId);
    App.render();

    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else App.renderGoalTasks(goal);
    return;
  },

  showDeleteGoalModal() {
    App.showOverlay();
    App.slctr.deleteGoalModal.classList.toggle("elem-hide");
    setTimeout(() => {
      App.slctr.deleteGoalModal.classList.toggle("modal-fade");
      App.slctr.deleteGoalYesBtn.focus();
    }, 1);
    return;
  },
  hideDeleteGoalModal() {
    App.hideOverlay();
    App.slctr.deleteGoalModal.dataset.taskid = "";
    App.slctr.deleteGoalModal.classList.toggle("modal-fade");
    setTimeout(
      () => App.slctr.deleteGoalModal.classList.toggle("elem-hide"),
      276
    );
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
        headerIcon = "icons/inboxIcon.svg";
        break;
      case "Today":
        headerText = "All tasks for you to complete today, have a great day!";
        headerIcon = "icons/starIcon.svg";
        break;
      case "Upcoming":
        headerText =
          "Upcoming tasks for you to do, including those that are overdue. You can do this!";
        headerIcon = "icons/upcomingIcon.svg";
        break;
      case "Goal":
        headerTitle = goalTitle;
        headerText = goalText;
    }

    insertHTML(App.slctr.header, upperHeaderHTML(content));
    insertHTML(
      App.slctr.header,
      headerInfoHTML(headerTitle, headerText, headerIcon, content)
    );
    insertHTML(App.slctr.header, lowerHeaderHTML(content));
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

    App.slctr.main.dataset.content = content;
    App.createHeaderContent(content);

    const vw = document.documentElement.clientWidth;
    if (vw < 700) App.toggleMain();

    App.slctr.taskBtnList.innerHTML = "";

    if (content === "Inbox") App.renderInboxTasks(Todo.inbox);
    else if (content === "Today") App.renderTodayTasks(Todo.inbox, Todo.goals);
    else if (content === "Upcoming")
      App.renderUpcomingTasks(Todo.inbox, Todo.goals);

    LastVisit.updateData("content", content);
    LastVisit.updateData("goalId", "");
    return;
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

    App.slctr.main.dataset.content = "Goal";
    App.slctr.main.dataset.goalid = goalBtn.id;

    const goal = Todo.getGoal(goalBtn.id);
    App.createHeaderContent("Goal", goal.gName, goal.gNote);

    const vw = document.documentElement.clientWidth;
    if (vw < 700) App.toggleMain();

    App.slctr.taskBtnList.innerHTML = "";
    App.renderGoalTasks(goal);

    LastVisit.updateData("content", "Goal");
    LastVisit.updateData("goalId", goal.gId);

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
          App.slctr.goalBtnList.removeChild(goalBtn);
          return;
        }
        Todo.createGoal({ name: goalBtnInput.value, id: goalId });
        App.renderGoalBtns(Todo.goals);
        return;
      } else if (e.key === "Escape") {
        App.slctr.goalBtnList.removeChild(goalBtn);
        return;
      }
    });
    return;
  },
  saveGoalNote(e) {
    const headerNote = document.querySelector("[data-app=headerText]");
    const headerNoteInput = document.querySelector(
      "[data-app=headerTextInput]"
    );
    const headerNoteValue = headerNoteInput.value;

    let origGoal = Todo.getGoal(App.slctr.main.dataset.goalid);

    if (e.key === "Enter") {
      if (!headerNoteValue.trim()) return;

      Todo.updateGoal({ ...origGoal, gNote: headerNoteValue });
      headerNoteInput.classList.add("elem-hide");
      headerNote.classList.remove("elem-hide");
      headerNote.textContent = headerNoteValue;

      return;
    }
  },
  removeGoal() {
    const goalId = App.slctr.main.dataset.goalid;
    Todo.removeGoal(goalId);
    App.renderGoalBtns(Todo.goals);

    const firstGoalBtn = App.slctr.goalBtnList.firstElementChild;
    firstGoalBtn ? firstGoalBtn.click() : App.slctr.inboxBtn.click();

    App.hideDeleteGoalModal();
  },
  moveGoalProgBar(goalId) {
    if (!goalId) return;
    const goalBtn = document.getElementById(goalId);
    const goalProgIntrvl = goalBtn.querySelector(
      "[data-app=goalProgressInterval]"
    );

    const goal = Todo.getGoal(goalId);
    const taskCount = goal.tasks.length;
    const completedTaskCount = goal.tasks.filter(
      (task) => task.completed
    ).length;

    const percntForEachTask = 100 / taskCount;
    const percntToMove = percntForEachTask * completedTaskCount;
    goalProgIntrvl.style.marginRight = `${percntToMove}%`;
    return;
  },

  createTaskBtn() {
    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;
    const noTask = document.querySelector("[data-app=noTask]");

    if (content === "Today" || content === "Upcoming") return;

    const taskId = TodoTemp.gnrtTaskId();
    const taskBtn = taskBtnHTML(taskId, "", "", "");

    if (noTask) noTask.remove();
    insertHTML(App.slctr.taskBtnList, taskBtn);

    Todo.createTask({ name: "", id: taskId }, content, goalId);
    App.render();

    return;
  },
  toggleCheckTask(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const checkboxIcon = taskBtn.querySelector(".checkbox-icon");

    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;

    if (content === "Today" || content === "Upcoming") return;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(goalId, taskBtn.id);

    if (e.which === 1 || e.key === "Enter" || e.key === " ") {
      let status = parseInt(checkboxIcon.dataset.status) ? false : true;
      Todo.updateTask(
        {
          ...origTask,
          completed: status,
        },
        content,
        goalId
      );

      App.moveGoalProgBar(goalId);

      content === "Inbox"
        ? App.renderInboxTasks(Todo.inbox)
        : App.renderGoalTasks(Todo.getGoal(goalId));

      return;
    }
  },
  saveTaskName(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const taskNameInput = taskBtn.querySelector("[data-app=taskNameInput]");

    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;

    if (content === "Today" || content === "Upcoming") return;

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

  toggleTaskSettings(e) {
    const content = App.slctr.main.dataset.content;
    if (content === "Today" || content === "Upcoming") return;

    if (e.which === 1 || e.key === "Enter" || e.key === " ") {
      const task = e.target.closest("[data-app=task]");
      const taskNoteInput = task.querySelector("[data-app=taskTextInput]");
      const taskBtns = task.querySelectorAll(
        "[data-app=taskBtnFrame] > .taskBtn"
      );

      task.classList.toggle("task-collapse");
      setTabIndex(taskNoteInput);
      setTabIndex(taskBtns);
      return;
    }
  },
  saveTaskNote(e) {
    const taskBtn = e.target.closest("[data-app=task]");
    const taskNoteInput = taskBtn.querySelector("[data-app=taskTextInput]");

    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;

    if (content === "Today" || content === "Upcoming") return;

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
    const content = App.slctr.main.dataset.content;
    if (content === "Today" || content === "Upcoming") return;

    const task = e.target.closest(".task");
    App.slctr.dateModal.dataset.taskid = task.id;
    App.showOverlay();
    App.slctr.dateModal.classList.toggle("elem-hide");
    setTimeout(() => {
      App.slctr.dateModal.classList.toggle("modal-fade");
      App.slctr.monthInput.focus();
    }, 1);
    return;
  },
  hideDateModal() {
    App.hideOverlay();
    App.slctr.dateModal.dataset.taskid = "";
    App.slctr.dateModal.classList.toggle("modal-fade");
    setTimeout(() => App.slctr.dateModal.classList.toggle("elem-hide"), 276);
    return;
  },
  saveTaskDate() {
    const taskId = App.slctr.dateModal.dataset.taskid;
    const taskBtn = document.getElementById(taskId);

    const year = parseInt(App.slctr.yearInput.value);
    const month = d.parseMonthInt(App.slctr.monthInput.value);
    const day = parseInt(App.slctr.dayInput.value);

    if (year < 0 || !year) return;
    else if (!month) return;
    else if (!day || day < 0 || day > 32) return;

    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;

    let origTask =
      content === "Inbox"
        ? Todo.getInboxTask(taskBtn.id)
        : Todo.getGoalTask(App.slctr.main.dataset.goalid, taskBtn.id);

    const date = [year, month, day];

    Todo.updateTask({ ...origTask, tDueDate: date }, content, goalId);

    content === "Inbox"
      ? App.renderInboxTasks(Todo.inbox)
      : App.renderGoalTasks(Todo.getGoal(goalId));

    App.hideDateModal();
    App.render();
    return;
  },

  removeTask(e) {
    const taskBtnList = App.slctr.taskBtnList;
    const taskBtn = e.target.closest("[data-app=task]");
    const content = App.slctr.main.dataset.content;
    const goalId = App.slctr.main.dataset.goalid;
    if (content === "Today" || content === "Upcoming") return;

    Todo.removeTask(taskBtn.id, content, goalId);
    taskBtn.remove();

    if (taskBtnList.children.length === 0) {
      insertHTML(
        taskBtnList,
        noTaskHTML(
          "You have no tasks at your disposal. Are you inclined to add one?"
        )
      );
    }

    App.render();
    return;
  },

  renderGoalBtns(goals) {
    App.slctr.goalBtnList.innerHTML = "";
    if (goals.length === 0) return;
    goals.forEach((goal) => {
      const goalBtn = goalBtnHTML(goal.gId, goal.gName);
      insertHTML(App.slctr.goalBtnList, goalBtn);
      App.moveGoalProgBar(goal.gId);
    });
    document
      .querySelectorAll(".goalBtn")
      .forEach((goalBtn) =>
        goalBtn.addEventListener("click", App.renderGoalContent)
      );
    return;
  },
  renderGoalTasks(goal) {
    App.slctr.taskBtnList.innerHTML = "";
    if (goal.tasks.length === 0) {
      insertHTML(
        App.slctr.taskBtnList,
        noTaskHTML(
          "Want to reach your goal? Add tasks now and you'll reach it in no time."
        )
      );
      return;
    }
    goal.tasks.sort(d.sortDatesToBefore);
    goal.tasks.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
      return;
    });
    return;
  },

  renderInboxTasks(inbox) {
    App.slctr.taskBtnList.innerHTML = "";
    if (inbox.length === 0) {
      insertHTML(
        App.slctr.taskBtnList,
        noTaskHTML(
          "Nothing on your inbox. Better start adding tasks for you to do!"
        )
      );
      return;
    }
    inbox.sort(d.sortDatesToBefore);
    inbox.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
      return;
    });
    App.renderInboxTaskCount(Todo.inbox);
    return;
  },
  renderInboxTaskCount(inbox) {
    if (inbox.length === 0) {
      App.slctr.inboxTaskCnt.classList.add("taskCnt-hide");
      App.slctr.inboxDueTaskCnt.classList.add("taskCnt-hide");
      return;
    }
    App.slctr.inboxTaskCnt.classList.remove("taskCnt-hide");
    App.slctr.inboxTaskCnt.textContent = inbox.length;

    if (getDueTaskCount(inbox)) {
      App.slctr.inboxDueTaskCnt.classList.remove("taskCnt-hide");
      App.slctr.inboxDueTaskCnt.textContent = getDueTaskCount(inbox);
      return;
    }
    App.slctr.inboxDueTaskCnt.classList.add("taskCnt-hide");

    return;
  },

  renderTodayTasks(inbox, goals) {
    App.slctr.taskBtnList.innerHTML = "";
    let tasks = [...inbox];
    goals.forEach((goal) => {
      goal.tasks.forEach((task) => {
        tasks.push(task);
      });
    });
    tasks = tasks.filter((task) => d.isDateNow(task.tDueDate));
    if (tasks.length === 0) {
      insertHTML(
        App.slctr.taskBtnList,
        noTaskHTML("No tasks for you today. Horray!")
      );
      return;
    }

    tasks.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed,
        task.content
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
      return;
    });
    App.renderTodayTaskCount();
    return;
  },
  renderTodayTaskCount() {
    let tasks = [...Todo.inbox];
    Todo.goals.forEach((goal) => {
      goal.tasks.forEach((task) => {
        tasks.push(task);
      });
    });
    tasks = tasks.filter((task) => d.isDateNow(task.tDueDate));
    if (tasks.length === 0) {
      App.slctr.todayTaskCnt.classList.add("taskCnt-hide");
      return;
    }

    App.slctr.todayTaskCnt.classList.remove("taskCnt-hide");
    App.slctr.todayTaskCnt.textContent = tasks.length;
    return;
  },

  renderUpcomingTasks(inbox, goals) {
    App.slctr.taskBtnList.innerHTML = "";
    let tasks = [...inbox];
    goals.forEach((goal) => {
      goal.tasks.forEach((task) => {
        tasks.push(task);
      });
    });
    tasks.sort(d.sortDatesToBefore);
    tasks = tasks.filter((task) => {
      if (!task.tDueDate) return false;
      else return d.isPastDue(task.tDueDate) || d.isNotDue(task.tDueDate);
    });
    if (tasks.length === 0) {
      insertHTML(
        App.slctr.taskBtnList,
        noTaskHTML(
          "You have no upcoming tasks. Is that a good thing or a bad one?"
        )
      );
      return;
    }

    tasks.forEach((task) => {
      const taskBtn = taskBtnHTML(
        task.tId,
        task.tName,
        task.tNote,
        task.tDueDate,
        task.completed,
        task.content
      );
      insertHTML(App.slctr.taskBtnList, taskBtn);
      return;
    });
    App.renderUpcomingTaskCount();
    return;
  },
  renderUpcomingTaskCount() {
    let tasks = [...Todo.inbox];
    Todo.goals.forEach((goal) => {
      goal.tasks.forEach((task) => {
        tasks.push(task);
      });
    });
    tasks = tasks.filter((task) => {
      if (!task.tDueDate) return false;
      else return d.isPastDue(task.tDueDate) || d.isNotDue(task.tDueDate);
    });

    if (tasks.length === 0) {
      App.slctr.upcomingTaskCnt.classList.add("taskCnt-hide");
      App.slctr.upcomingDueTaskCnt.classList.add("taskCnt-hide");
      return;
    }
    App.slctr.upcomingTaskCnt.classList.remove("taskCnt-hide");
    App.slctr.upcomingTaskCnt.textContent = tasks.length;

    if (getDueTaskCount(tasks)) {
      App.slctr.upcomingDueTaskCnt.classList.remove("taskCnt-hide");
      App.slctr.upcomingDueTaskCnt.textContent = getDueTaskCount(tasks);
      return;
    }
    App.slctr.upcomingDueTaskCnt.classList.add("taskCnt-hide");
    return;
  },

  renderLastVisit() {
    const content = LastVisit.getData("content");
    const isDark = LastVisit.getData("isDark");
    const goalId = LastVisit.getData("goalId");

    isDark ? App.toggleDarkMode() : App.toggleLightMode();

    if (goalId) {
      const goalBtns = document.querySelectorAll(".goalBtn");
      goalBtns.forEach((goalBtn) => {
        if (goalBtn.id === goalId) {
          goalBtn.click();
          return;
        }
        return;
      });
      return;
    }

    content ? App.renderContent(content) : App.renderContent("Inbox");
    return;
  },

  bindHeaderEvents() {
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=closeMainBtn]",
      App.toggleMain
    );

    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=headerSettingsBtn]",
      App.toggleHeaderSettings
    );
    delegateEvent(
      App.slctr.header,
      "keyup",
      "[data-app=headerSettingsBtn]",
      App.toggleHeaderSettings
    );

    delegateEvent(
      App.slctr.header,
      "keyup",
      "[data-app=headerTextInput]",
      App.saveGoalNote
    );

    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=trashAllTasksBtn]",
      App.trashAllTasks
    );
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=toggleCheckAllTasksBtn]",
      App.toggleCheckAllTasks
    );
    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=clrCmpltdTasksBtn]",
      App.clearCompletedTasks
    );

    delegateEvent(
      App.slctr.header,
      "click",
      "[data-app=deleteGoalBtn]",
      App.showDeleteGoalModal
    );
  },

  bindTaskEvents() {
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskInfo]",
      App.toggleTaskSettings
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskInfo]",
      App.toggleTaskSettings
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskDueDate]",
      App.toggleTaskSettings
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskName]",
      App.toggleTaskSettings
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskContent]",
      App.toggleTaskSettings
    );

    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=taskCheckbox]",
      App.toggleCheckTask
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskCheckbox]",
      App.toggleCheckTask
    );

    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskNameInput]",
      App.saveTaskName
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "keyup",
      "[data-app=taskTextInput]",
      App.saveTaskNote
    );
    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=trashTaskBtn]",
      App.removeTask
    );

    delegateEvent(
      App.slctr.taskBtnList,
      "click",
      "[data-app=setTaskDateBtn]",
      App.showDateModal
    );
  },

  init() {
    setTimeout(() => {
      App.slctr.introSplshScrn.classList.add("elem-hide");
    }, 4200);

    App.slctr.overlay.addEventListener("click", App.hideModal);

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
    App.slctr.lightModeBtn.addEventListener("click", App.toggleLightMode);
    App.slctr.darkModeBtn.addEventListener("click", App.toggleDarkMode);

    App.slctr.newBtn.addEventListener("click", (e) => {
      App.toggleAccrd(e, App.slctr.accrdNew);
      setTabIndex(App.slctr.accrdNewBtns);
    });

    App.slctr.newGoalBtn.addEventListener("click", App.createGoalBtn);
    App.slctr.newTaskBtns.forEach((newTaskBtn) => {
      newTaskBtn.addEventListener("click", App.createTaskBtn);
    });

    App.slctr.saveDateBtn.addEventListener("click", App.saveTaskDate);
    App.slctr.cancelDateBtn.addEventListener("click", App.hideDateModal);

    App.slctr.deleteGoalYesBtn.addEventListener("click", App.removeGoal);
    App.slctr.deleteGoalNoBtn.addEventListener(
      "click",
      App.hideDeleteGoalModal
    );

    App.bindHeaderEvents();
    App.bindTaskEvents();
    App.render();
    App.renderLastVisit();
  },

  render() {
    App.renderInboxTaskCount(Todo.inbox);
    App.renderTodayTaskCount();
    App.renderUpcomingTaskCount();
    App.renderGoalBtns(Todo.goals);
  },
};

App.init();
