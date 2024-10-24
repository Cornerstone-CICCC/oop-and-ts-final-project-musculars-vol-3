import { validateEnvVariable } from "astro/env/runtime";

type TaskList = {
  id: number | undefined;
  title: string;
  description: string;
  status: string;
  assignees: string[];
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
      status: data.status,
      assignees: data.assignees
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
    console.log(":)");
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
      <p class="card-desc">${item.description}</p>
      <p>${item.assignees}</p>
      `;

      const option = newTask.querySelector(".option");
      const edit  = newTask.querySelector(".edit");

      if(edit){
        edit.addEventListener("click", (e) => {
          // console.log(e.target)
          const eventTarget = e.target as HTMLImageElement

          const eventId = Number(eventTarget.getAttribute("todo-id"))

          const overlayEdit = document.createElement("div")
          overlayEdit.classList.add("overlay")
          overlayEdit.innerHTML = `
            <div class="edit-modal">
              <div class="everything">
                <div class="info">
                  <div class="edit-title">
                    <h2>Title</h2>
                    <img class="pencil-btn-title" src="./edit.png" alt="pencil icon">
                  </div>
                  <p>${item.title}</p>
                  <input type="text" class="edit-input-title">
                  <div class="edit-description">
                    <h2>Description</h2>
                    <img class="pencil-btn-description" src="./edit.png" alt="pencil icon">
                  </div>
                  <p>${item.description}</p>
                  <input type="text" class="edit-input-description">
                </div>
                <div class="assignees">
                  <h2>Assignees</h2>
                  <ul>
                    <li><input class="assign" type="checkbox" name="assignee" value="Eva" id="taskTitle"><p>Eva</p></li>
                    <li><input class="assign" type="checkbox" name="assignee" value="Yuta" id="taskTitle"><p>Yuta</p></li>
                    <li><input class="assign" type="checkbox" name="assignee" value="Risa" id="taskTitle"><p>Risa</p></li>
                  </ul>
                </div>
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
          
          // check input on edit modal if its already on the assignees array 
          const inputs = document.querySelectorAll(".assign")
          // console.log(item.assignees)
          inputs.forEach(input => {
            // console.log((<HTMLInputElement>input).value)
            item.assignees.forEach((assignee) => {
              if((<HTMLInputElement>input).value === assignee){
                (<HTMLInputElement>input).checked = true;
              }
            })
          })


          document.querySelector(".save-btn")?.addEventListener("click", () => {
            const inputDescription = document.querySelector<HTMLElement>(".edit-input-description")
            const inputTitle = document.querySelector<HTMLElement>(".edit-input-title")
            const pencilDescription = document.querySelector<HTMLElement>(".pencil-btn-description");
            const pencilTitle = document.querySelector<HTMLElement>(".pencil-btn-title")
            const valueTitle = (<HTMLInputElement> document.querySelector(".edit-input-title")).value;
            const valueDescription = (<HTMLInputElement> document.querySelector(".edit-input-description")).value;

            //create new array of edited elements 
            const newAssignees = Array.from(document.querySelectorAll('input[name="assignee"]:checked')).map(
              (checkbox) => (checkbox as HTMLInputElement).value
            )
            console.log(newAssignees)
            
            this.updateTask(eventId, {
              id: eventId,
              title: valueTitle,
              description: valueDescription,
              status: item.status,
              assignees: newAssignees

            })

            if(!valueDescription && valueTitle){
              this.updateTask(eventId, {
                id: eventId,
                title: valueTitle,
                description: item.description,
                status: item.status,
                assignees: newAssignees
              })

            } else if(!valueTitle && valueDescription){
              this.updateTask(eventId, {
                id: eventId,
                title: item.title,
                description: valueDescription,
                status: item.status, 
                assignees: newAssignees
              })
            } else if(!valueTitle && !valueDescription){
              this.updateTask(eventId, {
                id: eventId,
                title: item.title,
                description: item.description,
                status: item.status, 
                assignees: newAssignees
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
            <button class="btn-delete">Delete Item</button>
            <button class="btn-cancel">Cancel</button>
          </div>`;
          document.body.append(overlay);

          document.querySelector(".delete")?.addEventListener("click", () => {
            let parent = event.target?.parentNode.parentNode.parentNode.id // todo : find a better way
              .toString()
              .substring(5);
            this.deleteTask(parseInt(parent));
          });

          document
            .querySelector(".btn-cancel")
            ?.addEventListener("click", () => {
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
