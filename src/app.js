import {
  delegateEvent,
  insertHTML,
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

    newGoalBtn: document.querySelector("[data-app=newGoalBtn]"),
    goalList: document.querySelector("[data-app=goalList]"),
  },
  createGoalBtn() {
    const goalBtn = document.createElement("button");
    goalBtn.classList.add("goalBtn");
    goalBtn.id = TodoTemp.generateId();
    insertHTML(goalBtn, goalLabelHTML());
    App.slctr.goalList.insertAdjacentElement("afterbegin", goalBtn);

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
      App.slctr.goalList.insertAdjacentElement("afterbegin", goalBtn);
    });
    return;
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
