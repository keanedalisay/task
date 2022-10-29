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

  createGoal(goal) {
    this.goals.push({
      gName: goal.name,
      gId: goal.id,
      tasks: [],
    });
    this._save();
    return;
  }
  createTask(task, tabName, goalId) {
    if (tabName === "Inbox") {
      this.inbox.push({
        tName: task.name,
        tId: task.id,
        tNote: "",
        tDueDate: "",
        completed: false,
      });
      this._save();
      return;
    }
  }

  updateTask(newTask, tabName, goalId) {
    console.log(newTask);
    if (tabName === "Inbox") {
      this.inbox = this.inbox.map((task) =>
        task.tId === newTask.tId ? newTask : task
      );
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
