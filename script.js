let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {

    const taskInput = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;
    
    if(taskInput.value.trim() === "") return;

    tasks.push({
        text: taskInput.value,
        priority: priority,
        dueDate: dueDate,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function renderTasks() {

    const taskList = document.getElementById("taskList");
    const search = document.getElementById("searchInput").value.toLowerCase();

    taskList.innerHTML = "";

    let completed = 0;

    tasks.forEach((task,index)=>{

        if(!task.text.toLowerCase().includes(search))
            return;

        if(task.completed) completed++;

        const li = document.createElement("li");

        li.innerHTML = `
        <div>
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>
            <span class="${task.priority.toLowerCase()}">
                (${task.priority})
            </span>

            <br>

            <small>📅 Due: ${task.dueDate || "Not Set"}</small>
        </div>

        <div class="actions">
            <button onclick="toggleTask(${index})">✓</button>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleTask(index){
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

function editTask(index){

    let newTask = prompt("Edit Task",tasks[index].text);

    if(newTask !== null && newTask.trim() !== ""){
        tasks[index].text = newTask;
        saveTasks();
        renderTasks();
    }
}

function updateStats(){

    const total = tasks.length;
    const completed = tasks.filter(t=>t.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;

    let progress = total === 0 ? 0 : (completed/total)*100;

    document.getElementById("progressBar").style.width =
    progress + "%";
    document.getElementById("progressText").innerText=Math.round(progress) + "% Completed";
}

document
.getElementById("searchInput")
.addEventListener("input",renderTasks);

renderTasks();