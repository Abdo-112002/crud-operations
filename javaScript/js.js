// setting valribule
let container = document.querySelector(".container"),
    input = document.querySelector(".input"),
    addTask = document.querySelector(".add"),
    tasksContainer = document.querySelector(".tasks"),
    itemComplated = document.querySelector(".complate"),
    counterItem = document.querySelector(".counter"),
    removeAllTasks = document.querySelector(".remove-all-tasks"),
    editBtn = document.querySelector(".edit-btn"),
    searchTasks = document.querySelector("#search");

    // var to save task id on edit mode
    let abdo = null;

// Empty array to store the tasks
let arrayOfTasks = JSON.parse(localStorage.getItem("tasks")) ? JSON.parse(localStorage.getItem("tasks")) : [];

// trigger get Data From LocalStorage function
getDataFromLocalStorage();

// trigger count Copmplated Task  function
countCopmplatedTask();

// check input and send data
addTask.addEventListener("click",(eo) => {
    if(input.value !== ""){
       
        // check edit or add opration function
        editOrAdd();

    }else {
        alert("the input is empty");
    }
});

// check buttons delete and updata 
tasksContainer.addEventListener("click",(eo) => {
    // delete button
    if(eo.target.classList.contains("remove")) {
        let task = eo.target.parentElement.parentElement;
        let getTaskId = task.querySelector(".text").id;
        // remove task from page
        task.remove();
        // remove task from array of tasks
        removeTask(getTaskId);
    }

    //Done task element
    if(eo.target.classList.contains("task")){
        // toggle done class
        eo.target.classList.toggle("done");

        // toggle complated for the task
        toggleStatusTask(eo.target.querySelector(".text").id);
    }

    // editing on task
    if(eo.target.classList.contains("edit-icon")) {
        let task = eo.target.parentElement.parentElement;
        // call edit function 
        editTask(task);
    }
});

// remove all tasks from page and local storage
removeAllTasks.addEventListener("click", function() {
    // empty all elements
    tasksContainer.innerHTML = "Empty...";
    localStorage.removeItem("tasks");
    arrayOfTasks = [];
    counterItem.innerHTML = 0;
    itemComplated.innerHTML = 0;

    settingAddTaskBtn();
});

// search on by name tasks
searchTasks.addEventListener("keyup",(eo) => {
    //convert text to lowerCase
    let text = eo.target.value.toLowerCase();

    // get items
    let allTasks = tasksContainer.querySelectorAll(".task");
    
    allTasks.forEach((item) => {
        let itemName = item.firstElementChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = "flex";
        }else {
            item.style.display = "none";
        }
    });
});

function editOrAdd() {
    if(abdo !== null && dontRepeateTask(input.value) !== true){
        document.getElementById(`${abdo}`).innerHTML = input.value;
        arrayOfTasks.forEach((item) => {
            if(item.id.toString() === abdo){
                item.title = input.value;
            }
        });
        saveInLocalStorage(arrayOfTasks);

       settingAddTaskBtn();
    }else{
        // call add task to arry function
        addItem(input.value); // add task to array
        input.value = ""; // empty input
        input.focus(); 
    }
}

// add item function
function addItem(itemValue) {
    // check if the item repeated or no function;
    let repeated =  dontRepeateTask(itemValue);

    if(repeated !== true){  // check the item repeate or not if not rpeate add a new task
         // new task data
        const task ={
            id: Date.now(),
            title: itemValue,
            completed : false,
        }
        // push task to array of tasks
        arrayOfTasks.push(task);
        // add task element to page function
        addTaskToPage(arrayOfTasks); 
        // save data in localStorage
        saveInLocalStorage(arrayOfTasks);

    }else {
        alert("this task is repeate")
    }
}

function settingAddTaskBtn() {
    abdo = null;
    input.value = ""; 
    addTask.value = "Add Task";
    addTask.style.cssText = "background : brown;";
}

// count tasks function
function itemsTimer(data) {
    counterItem.innerHTML = data.length;
}

// check function
function dontRepeateTask(text){
    let valid = false;
    arrayOfTasks.forEach((item) => {
        if(item.title === text.trim()){
            valid = true;
        }
    });
    return valid;
}

// add task to page
function addTaskToPage(tasks){
    // Empty tasks Container
    tasksContainer.innerHTML = "";
    // loopin on array of tasks
    tasks.forEach((task) => {
        let {id,title,completed} = task;
        let element = `
            <li class="${completed === true ? "task done" : "task"}">
                <p class="text" id="${id}">${title}</p>
                <div class="controll">
                    <button type="button" class="material-icons edit-icon">edit</button>
                    <button type="button" class="material-icons remove">delete</button>
                </div>
            </li>
        `;
        tasksContainer.innerHTML += element;
    });

    itemsTimer(tasks); // add item count function
}

// saveInLocalStorage function
function saveInLocalStorage(tasks){
    window.localStorage.setItem("tasks",JSON.stringify(tasks));
}

//get Data From Local Storage
function getDataFromLocalStorage(){
    let data  = localStorage.getItem("tasks");
    if(data) {
        let tasks = JSON.parse(data);
        // call add task to page function
        addTaskToPage(tasks);
    }
};

// remove task function
function removeTask(theTaskId) {
     arrayOfTasks = arrayOfTasks.filter((item) => {
        return item.id !== Number(theTaskId);
    });

    // update data in local storage
    saveInLocalStorage(arrayOfTasks);
    itemsTimer(arrayOfTasks);
    countCopmplatedTask();

    // setting add task btn when the user deleted the task 
    settingAddTaskBtn();
}

//toggle StatusTask function
function toggleStatusTask(theTaskId){
    arrayOfTasks.forEach((task) => {
        if(task.id === Number(theTaskId)) {
           (task.completed === false) ? (task.completed = true) : (task.completed = false);
        }
    });

    // update data in local storage
    saveInLocalStorage(arrayOfTasks);

    // update complated task function
    countCopmplatedTask();
}

//count Copmplated Task function
function countCopmplatedTask() {
    let complatedTask = arrayOfTasks.filter(item => item.completed === true);

    //count complated task 
    itemComplated.innerHTML =  complatedTask.length;
}

// edet element function
function editTask(task) {
    // get task element 
    let getTaskText = task.querySelector(".text").innerHTML;
    // return the value of element to the input fild
    input.value = getTaskText;
    input.focus();
    // reassign element id to the global var
    abdo = task.querySelector(".text").id;
    // convert addTask btn to save edit btn
    addTask.value = "Save Edit";
    addTask.style.cssText = "background : green;";
}

// toggle open list in small screen
let listIcon = document.querySelector(".list-icon").addEventListener("click",(eo) => {
    document.querySelector(".detail-info").classList.toggle("active");
    (eo.target.innerHTML == "segment") ? (eo.target.innerHTML = "close") : (eo.target.innerHTML = "segment");
});
