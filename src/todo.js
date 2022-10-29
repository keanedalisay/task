export class TodoTemp {
  static gnrtGoalId() {
    const id = `G-${("000000000" + Math.random().toString(36)).slice(-6)}`;
    return id;
  }
  static gnrtTaskId() {
    const id = `T${("000000000" + Math.random().toString(36)).slice(-6)}`;
    return id;
  }

  constructor() {
    window.addEventListener("storage", this._readGoals);
    window.addEventListener("storage", this._readInbox);
    this._readGoals();
    this._readInbox();

    this.getGoal = (goalId) => this.goals.find((goal) => goal.gId === goalId);
    this.getInboxTask = (taskId) =>
      this.inbox.find((task) => task.tId === taskId);
    this.getGoalTask = (goalId, taskId) =>
      this.getGoal(goalId).tasks.find((task) => task.tId === taskId);
  }

  createGoal(obj) {
    const goal = {
      gName: obj.name,
      gId: obj.id,
      gNote: "",
      tasks: [],
    };
    this.goals.push(goal);
    this._save();
    return;
  }
  createTask(obj, content, goalId) {
    const task = {
      tName: obj.name,
      tId: obj.id,
      tNote: "",
      tDueDate: "",
      completed: false,
    };
    if (content === "Inbox") {
      this.inbox.push(task);
      this._save();
      return;
    } else if (content === "Goal") {
      const newGoal = this.getGoal(goalId);
      newGoal.tasks.push(task);
      this.goals = this.goals.map((origGoal) =>
        origGoal.gId === newGoal.gId ? newGoal : origGoal
      );
      this._save();
      return;
    }
  }

  updateTask(newTask, content, goalId) {
    if (content === "Inbox") {
      this.inbox = this.inbox.map((origTask) =>
        origTask.tId === newTask.tId ? newTask : origTask
      );
      this._save();
      return;
    } else if (content === "Goal") {
      let newGoal = this.getGoal(goalId);
      newGoal.tasks = newGoal.tasks.map((origTask) =>
        origTask.tId === newTask.tId ? newTask : origTask
      );
      this.goals = this.goals.map((origGoal) =>
        origGoal.gId === newGoal.gId ? newGoal : origGoal
      );
      this._save();
      return;
    }
  }

  removeTask(origTaskId, content, goalId) {
    if (content === "Inbox") {
      this.inbox = this.inbox.filter((origTask) => origTask.tId !== origTaskId);
      this._save();
      return;
    } else if (content === "Goal") {
      let newGoal = this.getGoal(goalId);
      newGoal.tasks = newGoal.tasks.filter(
        (origTask) => origTask.tId !== origTaskId
      );
      this.goals = this.goals.map((origGoal) =>
        origGoal.gId === newGoal.gId ? newGoal : origGoal
      );
      this._save();
    }
  }

  _readGoals() {
    this.goals = JSON.parse(localStorage.getItem("goals") || "[]");
  }
  _readInbox() {
    this.inbox = JSON.parse(localStorage.getItem("inbox") || "[]");
  }
  _save() {
    localStorage.setItem("goals", JSON.stringify(this.goals));
    localStorage.setItem("inbox", JSON.stringify(this.inbox));
  }
}
