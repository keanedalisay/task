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
    this.goals = this._readGoals();
    this.inbox = this._readInbox();
  }
  createGoal(name, id) {
    const goal = {
      gName: name,
      gId: id,
      tasks: [],
    };
    this.goals.push(goal);
    this._save();
    return;
  }
  createTask(name, id, tabName, goalID) {
    const task = {
      tName: name,
      tId: id,
      tNote: "",
      tDueDate: "",
      completed: false,
    };
    if (tabName === "Inbox") {
      this.inbox.push(task);
      this._save();
      return;
    } else if (tabName === "Goal") {
      const goal = this.goals.find((goal) => goal.gId === goalID);
      const goalIndex = this.goals.findIndex((goal) => goal.gId === goalID);
      task.gId = goal.gId;
      goal.tasks.push(task);
      this.goals.splice(goalIndex, 1, goal);
      return;
    }
  }
  _readGoals() {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    return goals;
  }
  _readInbox() {
    const inbox = JSON.parse(localStorage.getItem("inbox") || "[]");
    return inbox;
  }
  _save() {
    localStorage.setItem("goals", JSON.stringify(this.goals));
    localStorage.setItem("inbox", JSON.stringify(this.inbox));
  }
}

// createGoal, createTask, read,
// updateGoal, updateTask,
// deleteGoal, deleteTask
// store
