import {
  delegateEvent,
  insertHTML,
  insertElem,
  setTabIndex,
  goalLabelHTML,
} from "./helpers.js";
import { TodoTemp } from "./todo.js";

const Todo = new TodoTemp();

const App = {
  slctr: {
    settingsBtn: document.querySelector("[data-app=settingsBtn]"),
    newBtn: document.querySelector("[data-app=newBtn]"),

    accrdSettings: document.querySelector("[data-app=accrdSettings]"),
    accrdSettingsBtns: document.querySelectorAll(
      "[data-app=accrdSettings] > .accrdBtn"
    ),
    accrdNew: document.querySelector("[data-app=accrdNew]"),
    accrdNewBtns: document.querySelectorAll("[data-app=accrdNew] > .accrdBtn"),

    navBtnList: document.querySelector("[data-app=navBtnList]"),
    goalList: document.querySelector("[data-app=goalList]"),
  },
  changeTab(elem) {
    const inboxBtn = document.querySelector("[data-app=inboxBtn]");
    const todayBtn = document.querySelector("[data-app=todayBtn");
    const upcomingBtn = document.querySelector("[data-app=upcomingBtn]");

    const headerInfoIcon = document.querySelector("[data-app=headerInfoIcon]");
    const headerInfoTitle = document.querySelector(
      "[data-app=headerInfoTitle]"
    );
    const headerInfoText = document.querySelector("[data-app=headerInfoText]");

    if (elem === inboxBtn) {
      inboxBtn.classList.add("selected-btn");
      todayBtn.classList.remove("selected-btn");
      upcomingBtn.classList.remove("selected-btn");

      headerInfoIcon.setAttribute("data", "../src/icons/inboxIcon.svg");
      headerInfoTitle.textContent = "Inbox";
      headerInfoText.textContent =
        "This is where your independent tasks are stored. Feel free to add as many as you like!";
      return;
    } else if (elem === todayBtn) {
      inboxBtn.classList.remove("selected-btn");
      todayBtn.classList.add("selected-btn");
      upcomingBtn.classList.remove("selected-btn");

      headerInfoIcon.setAttribute("data", "../src/icons/starIcon.svg");
      headerInfoTitle.textContent = "Today";
      headerInfoText.textContent =
        "All tasks for you to complete today, have a great day!";
      return;
    } else if (elem === upcomingBtn) {
      inboxBtn.classList.remove("selected-btn");
      todayBtn.classList.remove("selected-btn");
      upcomingBtn.classList.add("selected-btn");

      headerInfoIcon.setAttribute("data", "../src/icons/upcomingIcon.svg");
      headerInfoTitle.textContent = "Upcoming";
      headerInfoText.textContent =
        "Upcoming tasks for you to do, including those that are overdue. You can do this!";
      return;
    }
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
    delegateEvent(
      App.slctr.navBtnList,
      "click",
      "[data-app=inboxBtn]",
      App.changeTab
    );
    delegateEvent(
      App.slctr.navBtnList,
      "click",
      "[data-app=todayBtn]",
      App.changeTab
    );
    delegateEvent(
      App.slctr.navBtnList,
      "click",
      "[data-app=upcomingBtn]",
      App.changeTab
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
    App.render();
  },
};

App.init();
