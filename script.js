class Task {
    constructor(text, date) {
        this.text = text;
        this.isDone = false;
        this.taskRelatedDiv = null;
        this.dateTime = date;
    }

    putTaskInDiv(parentElement) {
        this.taskRelatedDiv = document.createElement("div");
        this.taskRelatedDiv.classList.add("task");

        let p = document.createElement("p");
        p.innerText = this.text;
        this.taskRelatedDiv.append(p);

        let dt = document.createElement("p");
        dt.innerText = this.dateTime;
        this.taskRelatedDiv.append(dt);

        const currentDate = new Date();
        const currentDateTime = currentDate.getTime();

        const taskDateTime = new Date(this.dateTime).getTime();
        if(taskDateTime < currentDateTime){
            dt.classList.add("overdue");
            dt.innerText += '\nInvalid date';
        }


        let checkBox = document.createElement("input");
        let checked = document.createElement("button");
        let me = this;
        checked.addEventListener("click", function () {
            me.changeState();
        });

        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn");
        checked.classList.add("completed");
        this.taskRelatedDiv.append(checked);

        let deleted = document.createElement("button");

        deleted.addEventListener("click", function () {
            taskStorage.deleteTask(me);
        });
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn");
        this.taskRelatedDiv.append(deleted);

        if (this.isDone) {
            this.taskRelatedDiv.classList.add("completed");
            checkBox.checked = true;
        }
        parentElement.append(this.taskRelatedDiv);
    }

    changeState() {
        this.isDone = !this.isDone;
        this.taskRelatedDiv.classList.toggle("completed");
    }
}

class TaskStorage {
    constructor() {
        this.tasks = [];
    }

    load() {
        const savedTask = localStorage.getItem("tasks");
        
        if (savedTask){
            this.tasks = JSON.parse(savedTask);
            this.tasks.forEach(t => t.putTaskInDiv(taskListDiv));
        }
    }

    addTask() {
        if (taskInput.value.length == "") {
            alert("You must write something!");
        } else {
            if (!startMessage.hidden) startMessage.hidden = true;

            let newTask = new Task(taskInput.value, dateTimeInput.value);
            newTask.putTaskInDiv(taskListDiv);
            taskInput.value = "";
            this.tasks.push(newTask);
            this.saveTasks();
        }
    }

    removeItem(array, item) {
        for (let i in array) {
            if (array[i] == item) {
                array.splice(i, 1);
                break;
            }
        }
    }

    deleteTask(task) {
        task.taskRelatedDiv.remove();
        this.removeItem(this.tasks, task);
        this.saveTasks();
    }
    saveTasks() {
        localStorage.setItem("tasks",JSON.stringify(this.tasks));
    }
}

let taskStorage = new TaskStorage();

let taskInput = document.querySelector("#taskInput");
let taskListDiv = document.querySelector(".task-list");
let startMessage = document.querySelector("#start-message");
let addBtn = document.querySelector("#addBtn");
let dateTimeInput = document.querySelector("#taskDate");
let standardTheme = document.querySelector('.standard-theme');
let lightTheme = document.querySelector('.light-theme');
let darkerTheme = document.querySelector('.darker-theme');

addBtn.addEventListener("click", () => taskStorage.addTask());
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));


taskInput.addEventListener("keydown", function (e) {
    if (e.code == "Enter") taskStorage.addTask();
})

function changeTheme(color) {
    localStorage.setItem("savedTheme", color);
    savedTheme = color;

    document.body.className = color;

    const flexrowContainer = document.querySelector(".flexrow-container");
    flexrowContainer.className = `flexrow-container ${color}-theme`;

    const titleElement = document.querySelector("#title");
    if (color === "darker") {
        titleElement.classList.add(".darker-title");
    } else {
        titleElement.classList.remove(".darker-title");
    }
    taskInput.className = `${color}-taskInput`;

}

class ButtonContainer {
    constructor() {
      this.allBtn = document.querySelector(".all");
      this.deleteAllBtn = document.querySelector(".delete");
      this.activeBtn = document.querySelector(".active");
  
      this.allBtn.addEventListener("click", this.showAllTasks.bind(this));
      this.deleteAllBtn.addEventListener("click", this.deleteAllTasks.bind(this));
      this.activeBtn.addEventListener("click", this.showActiveTasks.bind(this));
    }
  
    showAllTasks() {
      const allTasks = taskStorage.tasks;
      taskListDiv.innerHTML = '';
  
      for (let task of allTasks) {
        task.putTaskInDiv(taskListDiv);
      }
    }
  
    deleteAllTasks() {
      taskStorage.tasks = [];
      taskListDiv.innerHTML = '';
      // clean local storage
      localStorage.clear();
    }
  
    showActiveTasks() {
      const activeTasks = taskStorage.tasks.filter(task => !task.isDone);
      taskListDiv.innerHTML = '';
  
      for (let task of activeTasks) {
        task.putTaskInDiv(taskListDiv);
      }
    }
  }
  
  let buttonContainer = new ButtonContainer();
