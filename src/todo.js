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
    this.getGoalIndex = (goalId) =>
      this.goals.findIndex((goal) => goal.gId === goalId);
    this.getTask = (taskId, prop) => prop.find((task) => task.tId === taskId);
    this.getTaskIndex = (taskId, prop) =>
      prop.findIndex((task) => task.tId === taskId);
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
  createTask(name, id, tabName, goalId) {
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
      const goal = this.getGoal(goalId);
      const goalIndex = this.getGoalIndex(goalId);
      goal.tasks.push(task);
      this.goals.splice(goalIndex, 1, goal);
      this._save();
      return;
    }
  }
  updateTaskName(name, tabName, taskId, goalId) {
    if (tabName === "Inbox") {
      const task = this.getTask(taskId, this.inbox);
      const taskIndex = this.getTaskIndex(taskId, this.inbox);

      task.tName = name;
      this.inbox.splice(taskIndex, 1, task);
      this._save();
      return;
    } else if (tabName === "Goal") {
      const goal = this.getGoal(goalId);
      const goalIndex = this.getGoalIndex(goalId);
      const task = this.getTask(taskId, goal.tasks);
      const taskIndex = this.getTaskIndex(taskId, goal.tasks);

      task.tName = name;
      goal.tasks.splice(taskIndex, 1, task);
      this.goals.splice(goalIndex, 1, goal);
      this._save();
      return;
    }
  }
  updateTaskNote(note, tabName, taskId, goalId) {
    if (tabName === "Inbox") {
      const task = this.getTask(taskId, this.inbox);
      const taskIndex = this.getTaskIndex(taskId, this.inbox);

      task.tNote = note;
      this.inbox.splice(taskIndex, 1, task);
      this._save();
      return;
    } else if (tabName === "Goal") {
      const goal = this.getGoal(goalId);
      const goalIndex = this.getGoalIndex(goalId);
      const task = this.getTask(taskId, goal.tasks);
      const taskIndex = this.getTaskIndex(taskId, goal.tasks);

      task.tNote = note;
      goal.tasks.splice(taskIndex, 1, task);
      this.goals.splice(goalIndex, 1, goal);
      this._save();
      return;
    }
  }
  updateTaskCompletion(status, tabName, taskId, goalId) {
    if (tabName === "Inbox") {
      const task = this.getTask(taskId, this.inbox);
      const taskIndex = this.getTaskIndex(taskId, this.inbox);

      task.completed = Boolean(status);
      this.inbox.splice(taskIndex, 1, task);
      this._save();
      return;
    } else if (tabName === "Goal") {
      const goal = this.getGoal(goalId);
      const goalIndex = this.getGoalIndex(goalId);
      const task = this.getTask(taskId, goal.tasks);
      const taskIndex = this.getTaskIndex(taskId, goal.tasks);

      task.completed = Boolean(status);
      goal.tasks.splice(taskIndex, 1, task);
      this.goals.splice(goalIndex, 1, goal);
      this._save();
      return;
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

// update task does:
//

// createGoal, createTask, read,
// updateGoal, updateTask,
// deleteGoal, deleteTask
// store
