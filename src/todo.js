export class TodoTemp {
  static generateId() {
    const id = `G-${(
      "000000000" + Math.random().toString(36).substr(2, 9)
    ).slice(-6)}`;
    return id;
  }
  constructor() {
    window.addEventListener("storage", this._readStorage);
    this.goals = this._readStorage();
  }
  createGoal(name, id) {
    const goal = {
      gName: name,
      gId: id,
      tasks: [],
    };
    this.goals.push(goal);
    this._save();
  }
  _readStorage() {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    return goals;
  }
  _save() {
    localStorage.setItem("goals", JSON.stringify(this.goals));
  }
}

// createGoal, createTask, read,
// updateGoal, updateTask,
// deleteGoal, deleteTask
// store
