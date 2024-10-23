type TaskList = {
  id: number;
  title: string;
  description: string;
  status: string;
};

class Task {
  static taskId = 0;
  tasks: TaskList[];

  constructor() {
    this.tasks = [];
  }

  // add method
  addTask(newTask: TaskList) {
    newTask.id = Task.taskId++;
    this.tasks = [...this.tasks, newTask];
    this.renderTasks();
  }

  // update method
  updateTask() {
    return;
  }

  // delete method
  deleteTask() {
    return;
  }
}

// initialize Kanban board
class initialize {
  constructor() {}
}

export const tasks = new Task();
