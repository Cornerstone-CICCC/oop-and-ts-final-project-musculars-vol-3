type TaskList = {
  id: number;
  title: string;
  description: string;
  status: string;
};

class Task {
  static taskId = 0;
  static id = 0;
  tasks: TaskList[];
  filteredTask: TaskList[];
  isFiltered = false;

  constructor() {
    this.tasks = [];
    this.filteredTask = [];
  }

  // add method
  addTask(newTask: TaskList) {
    newTask.id = Task.id++;
    this.tasks = [...this.tasks, newTask];
    this.renderTasks();
  }

  addFilteredTask(newTask: TaskList) {
    this.filteredTask = [...this.filteredTask, newTask];
    this.isFiltered = true;
  }

  // update method
  updateTask() {
    return;
  }

  // delete method
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((item) => {
      return item.id !== id;
    });

    this.filteredTask = this.filteredTask.filter((item) => {
      return item.id !== id;
    });

    this.renderTasks();
  }

  resetFilter() {
    this.filteredTask = [];
    this.isFiltered = false;
    this.renderTasks();
  }

  onDrag(event: DragEvent, taskId: number): void {
    event.dataTransfer?.setData("taskId", taskId.toString());
  }

  onDrop(event: DragEvent, newCategory: string): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData("taskId");

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
    const overlay = document.querySelector(".overlay") as HTMLElement;
    if (overlay) {
      overlay.classList.remove("overlay");
      overlay.innerHTML = "";
    }

    const todoList = document.getElementById("list-todo") as HTMLUListElement;
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

    let targetList = this.isFiltered ? this.filteredTask : this.tasks;
    targetList.forEach((item) => {
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
        <img class="option" src="./ellipsis.png" alt="ellipsis">
      </div>
      <p class="card-desc">${item.description}</p>`;

      const option = newTask.querySelector(".option");
      if (option) {
        option.addEventListener("click", (event) => {
          const overlay = document.createElement("div");
          overlay.classList.add("overlay");
          overlay.innerHTML = `
          <div class="deleteConfirmation"> 
            <p>Are you sure you want to delete this item?</p>
            <p>This action cannot be undone </p>
            <button class="delete">Delete Item</button>
            <button class="cancel">Cancel</button>
          </div>`;
          document.body.append(overlay);

          document.querySelector(".delete")?.addEventListener("click", () => {
            let parent = event.target.parentNode.parentNode.id // todo : find a better way
              .toString()
              .substring(5);
            this.deleteTask(parseInt(parent));
          });

          document.querySelector(".cancel")?.addEventListener("click", () => {
            this.renderTasks();
          });
        });
      }

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
