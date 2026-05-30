const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = { todo, progress, done };

let taskData = {
    todo: [],
    progress: [],
    done: []
};



if(localStorage.getItem("tasks")){
    taskData  = JSON.parse(localStorage.getItem("tasks"));  //object milega

    for(let key in taskData){
        taskData[key].forEach((task)=>{
            renderTask(task.title, task.description, columns[key]);  //sirf key likhege to string jayege "todo", apneko DOM element bhejna h
        });
    }
}

//HTML elements are not draggable by default. in html, we have to add draggable="true"

let draggedItem;

let tasks = document.querySelectorAll(".task");


tasks.forEach((task)=>{
    task.addEventListener("drag", (e)=>{
        // draggedItem = e.target;
        draggedItem = task; //copy nahi ja rahi. Reference ja raha hai. JavaScript me DOM elements objects hote hain,objects variables me reference se store hote hain
    });
})

function addDrag(task){
    task.addEventListener("dragstart",()=>{
        draggedItem = task;
    });
}
//new wale task jo hoge , unme bhi event listener lagana padega



function addDragEventOnColumn(column){
    column.addEventListener("dragenter", (e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    //by default browser drop allow nahi karta isliye dragover event pe preventDefault laganapadega
    column.addEventListener("dragover", (e)=>{
        e.preventDefault(); // iska kaam h Browser ke built-in default behaviour ko rokna.
    })

    column.addEventListener("drop", (e)=>{
        e.preventDefault();
        column.appendChild(draggedItem);  //elemnt moved
        column.classList.remove("hover-over");
        updateCountAndTasks(); 
    });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);



// addTask Function

function addTask(title, desc, col){
    renderTask(title,desc, col)
    updateCountAndTasks();  // col ek DOM element hai , isliye id use karre ex. <div id="todo" class="task-column">
    // console.log(taskData);
}

function renderTask(title, desc, col){
    let template = `<div class="task" draggable="true">
                    <div class="task-header">
                        <h3>${title} </h3>
                        <button class="deletebutton">Delete</button>    
                    </div>

                    <div class="task-desc">
                        ${desc}
                    </div>
                </div>`;

    col.insertAdjacentHTML("beforeend", template);
}



// delete task

document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("deletebutton")){
        e.target.closest(".task").remove();
    }
    updateCountAndTasks();
});




//update count

function updateCountAndTasks(){
    [todo,progress,done].forEach((col)=>{
        let tasks = col.querySelectorAll(".task");
        col.querySelector(".task-count").textContent = tasks.length;

        taskData[col.id] = Array.from(tasks).map((task)=>{
            return {
                title : task.querySelector("h3").textContent ,
                description :  task.querySelector(".task-desc").innerHTML
            }
        });

        localStorage.setItem("tasks", JSON.stringify(taskData));
    });
};


updateCountAndTasks();


//add new task

// modal logic
let modal = document.querySelector(".modal");
let modalbg = document.querySelector(".modal .bg");

document.querySelector("#open-modal").addEventListener("click",function(){
    modal.classList.add("active");
});

modalbg.addEventListener("click",()=>{
    modal.classList.remove("active");
})

// add Todo task

let inp = document.querySelectorAll(".modal-box input");


document.querySelector("#add-new-task").addEventListener("click",function(){
    addTask(inp[0].value, inp[1].value, todo );
    modal.classList.remove("active");
    let newTask = todo.lastElementChild;
    addDrag(newTask);
    // inp[0].value = "";
    // inp[1].value= "";
})




// locastorage fech and render all task
// add drag to all task
// add 4 event to all colms
//addTask and render task
//delete task
//updateCount and task ( save all task to taskData and localStorage)
//modal view open 
// add task button ( add task, remove modal, select todolast child, add drag, updateCount and task)
