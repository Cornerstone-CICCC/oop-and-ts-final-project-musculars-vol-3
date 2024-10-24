import { validateEnvVariable } from "astro/env/runtime";

type TaskList = {
  id: number | undefined;
  title: string;
  description: string;
  status: string;
};

type TaskArray= TaskList[]

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
  updateTask(id: number | undefined, data: TaskList): void {
    const findTask = this.tasks.find((item) => {
      return item.id === id;
    });
    console.log(findTask)
    const updatedTask: TaskList= {
      ...findTask,
      id: data.id,
      title: data.title, 
      description: data.description,
      status: data.status
    }

    const filteredTasks = this.tasks.filter((item) => {
      return item.id !== item.id
    })

    this.tasks = [...filteredTasks, updatedTask]
    this.renderTasks();
  }

  // delete method
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((item) => {
      return item.id !== id;
    });
    this.renderTasks();
  }

  onDrag(event: DragEvent, taskId: number): void {
    event.dataTransfer?.setData("taskId", taskId.toString());
  }

  onDrop(event: DragEvent, newCategory: string): void {
    event.preventDefault();
    console.log("きたよ");
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

    this.tasks.forEach((item) => {
      const newTask = document.createElement("div");
      newTask.classList.add("card");

      newTask.id = `task-${item.id}`;
      newTask.setAttribute("todo-id", `${item.id}`)
      newTask.draggable = true;

      newTask.addEventListener("dragstart", (event) =>
        this.onDrag(event, item.id as number)
      );

      newTask.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${item.title}</h3>
        <div>
          <img class="edit" src="./edit.png" alt="edit icon" todo-id="${item.id}">
          <img class="option" src="./delete.png" alt="delete icon">
        </div>
      </div>
      <p class="card-desc">${item.description}</p>`;

      const option = newTask.querySelector(".option");
      const edit  = newTask.querySelector(".edit");

      if(edit){
        edit.addEventListener("click", (e) => {
          console.log(e.target)
          const eventTarget = e.target as HTMLImageElement

          const eventId = Number(eventTarget.getAttribute("todo-id"))

          const overlayEdit = document.createElement("div")
          overlayEdit.classList.add("overlay")
          overlayEdit.innerHTML = `
            <div class="edit-modal">
              <div class="info">
                <h2>Title</h2>
                <img class="pencil-btn-title" src="./edit.png" alt="pencil icon">
                <p>${item.title}</p>
                <input type="text" class="edit-input-title">
                <h2>Description</h2>
                <img class="pencil-btn-description" src="./edit.png" alt="pencil icon">
                <p>${item.description}</p>
                <input type="text" class="edit-input-description">
              </div>
              <div class="assignees">
                <h2>Assignees</h2>
                <ul>
                  <li><input type="checkbox"> User 1</li>
                  <li><input type="checkbox"> User 2</li>
                  <li><input type="checkbox"> User 3</li>
                  <li><input type="checkbox"> User 4</li>
                </ul>
              </div>
              <button class="save-btn">Save Changes</button>
              <img class="close-btn" src="./close.png" alt="close icon">
            </div> 
          `
          document.body.append(overlayEdit)

          document.querySelector(".close-btn")?.addEventListener("click", () => {
            this.renderTasks();
          })
          
          document.querySelector(".pencil-btn-title")?.addEventListener("click", () => {
            const inputTitle = document.querySelector<HTMLElement>(".edit-input-title")
            const pencilTitle = document.querySelector<HTMLElement>(".pencil-btn-title");
            if(inputTitle){
              inputTitle.style.display = "block"
            }
            if(pencilTitle){
              pencilTitle.style.display = "none"
            }
          })
          document.querySelector(".pencil-btn-description")?.addEventListener("click", () => {
            const inputDescription = document.querySelector<HTMLElement>(".edit-input-description")
            const pencilDescription = document.querySelector<HTMLElement>(".pencil-btn-description");
            if(inputDescription){
              inputDescription.style.display = "block"
            }
            if(pencilDescription){
              pencilDescription.style.display = "none"
            }
          })
          

          document.querySelector(".save-btn")?.addEventListener("click", () => {
            const inputDescription = document.querySelector<HTMLElement>(".edit-input-description")
            const inputTitle = document.querySelector<HTMLElement>(".edit-input-title")
            const pencilDescription = document.querySelector<HTMLElement>(".pencil-btn-description");
            const pencilTitle = document.querySelector<HTMLElement>(".pencil-btn-title")
            const valueTitle = (<HTMLInputElement> document.querySelector(".edit-input-title")).value;
            const valueDescription = (<HTMLInputElement> document.querySelector(".edit-input-description")).value;

          
            
            this.updateTask(eventId, {
              id: eventId,
              title: valueTitle,
              description: valueDescription,
              status: item.status
            })

            if(!valueDescription){
              this.updateTask(eventId, {
                id: eventId,
                title: valueTitle,
                description: item.description,
                status: item.status
              })
            } else if(!valueTitle){
              this.updateTask(eventId, {
                id: eventId,
                title: item.title,
                description: valueDescription,
                status: item.status
              })
            }
            
            if(inputDescription){
              inputDescription.style.display = "none"
            }
            if(pencilDescription){
              pencilDescription.style.display = "block"
            }
            if(inputTitle){
              inputTitle.style.display = "none"
            }
            if(pencilTitle){
              pencilTitle.style.display = "block"
            }
            
          })

        })
      }

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
            let parent = event.target?.parentNode.parentNode.parentNode.id // todo : find a better way
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
