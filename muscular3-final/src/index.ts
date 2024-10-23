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
    this.tasks = [...this.tasks, newTask];
    this.renderTasks();
  }

  // update method
  updateTask() {
    return;
  }

  // delete method
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((item) => item.id !== id);
    this.renderTasks();
  }

  onDrag(event: DragEvent, taskId: number): void {
    event.dataTransfer?.setData("taskId", taskId.toString());
  }

  onDrop(event: DragEvent, newCategory: string): void {
    event.preventDefault();
    console.log("きたよ");
    const taskId = event.dataTransfer?.getData("taskId");
    console.log(taskId);
    if (taskId) {
      const task = this.tasks.find((task) => task.id === parseInt(taskId));
      if (task) {
        task.status = newCategory;
        this.renderTasks();
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  renderTasks(): void {
    const todoList = document.getElementById("todo-list") as HTMLUListElement;
    const inProgressList = document.getElementById(
      "list-inprogress"
    ) as HTMLUListElement;
    const doneList = document.getElementById("list-done") as HTMLUListElement;

    if (!todoList || !inProgressList || !doneList) {
      return;
    }

    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    this.tasks.forEach((item) => {
      const newTask = document.createElement("div");
      newTask.classList.add("card");

      newTask.id = `task-${item.id}`;
      newTask.draggable = true;

      newTask.addEventListener("dragstart", (event) =>
        this.onDrag(event, item.id)
      );

      newTask.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${item.title}</h3>
        <img src="./ellipsis.png" alt="ellipsis">
      </div>
      <p class="card-desc">${item.description}</p>`;

      if (item.status === "Todo") {
        todoList.appendChild(newTask);
      } else if (item.status === "Inprogress") {
        inProgressList.appendChild(newTask);
      } else if (item.status === "Done") {
        doneList.appendChild(newTask);
      }
    });
  }
}

// initialize Kanban board
class initialize {
  constructor() {}
}

export const taskList = new Task();
