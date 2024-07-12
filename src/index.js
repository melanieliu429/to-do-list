import './style.css';

let workspaces = {};
let currentWorkspace = null;

function newTask(title, description, date, priority) {
    return {
        title: title,
        description: description,
        date: date,
        priority: priority,
        completed: false
    };
}

function newWorkspace(name, color) {
    return {
        name: name,
        color: color,
        tasks: []
    };
}

const createToDo = document.querySelector("#createToDo");
const newToDO = document.querySelector("#new-to-do");

newToDO.addEventListener("click", () => {
    if (currentWorkspace) {
        createToDo.style.visibility = "visible";
    } else {
        alert("Please select a workspace first.");
    }
});

createToDo.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const dueDate = document.querySelector("#date").value;
    let priority = "green";

    if (document.querySelector("#high").checked) {
        priority = "red";
    } else if (document.querySelector("#medium").checked) {
        priority = "yellow";
    }

    if (currentWorkspace) {
        addTaskToWorkspace(currentWorkspace, newTask(title, description, dueDate, priority));
        createToDo.style.visibility = "hidden";
        createToDo.reset();
    } else {
        alert("No workspace selected.");
    }
});

function addTaskToWorkspace(workspaceName, task) {
    if (workspaces[workspaceName]) {
        workspaces[workspaceName].tasks.push(task);
        displayTasks(workspaceName);
    }
}

const inbox = document.querySelector("#inbox");

function displayTasks(workspaceName) {
    inbox.innerHTML = "";
    if (workspaces[workspaceName]) {
        workspaces[workspaceName].tasks.forEach((task, index) => {
            const container = document.createElement("div");
            container.className = `taskContainer ${task.completed ? 'completed' : ''}`;
            container.style.borderLeft = `0.5rem solid ${task.priority}`;

            container.innerHTML = `
                <div class="task-status">
                    <input type="radio" class="status" style="accent-color: ${task.priority};" ${task.completed ? 'checked' : ''} data-index="${index}" data-workspace="${workspaceName}">
                </div>
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div>${task.description}</div>
                    <div>Due Date: ${task.date}</div>
                </div>
                <div class="task-delete">
                    <button class="delete" data-index="${index}" data-workspace="${workspaceName}">x</button>
                </div>
            `;
            inbox.appendChild(container);
        });

        addTaskEventListeners();
    }
}

function addTaskEventListeners() {
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const workspaceName = button.getAttribute("data-workspace");
            workspaces[workspaceName].tasks.splice(index, 1);
            displayTasks(workspaceName);
        });
    });

    const statusButtons = document.querySelectorAll(".status");
    statusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const workspaceName = button.getAttribute("data-workspace");
            workspaces[workspaceName].tasks[index].completed = !workspaces[workspaceName].tasks[index].completed;
            displayTasks(workspaceName);
        });
    });
}

const newWorkspaceButton = document.querySelector("#new-workspace");
const createWorkspace = document.querySelector("#createWorkspace");

newWorkspaceButton.addEventListener("click", () => {
    createWorkspace.style.visibility = "visible";
});

createWorkspace.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value;
    const color = document.querySelector("#color").value;

    if (workspaces[name]) {
        alert("Workspace with this name already exists.");
    } else {
        addWorkspace(newWorkspace(name, color));
        createWorkspace.style.visibility = "hidden";
        createWorkspace.reset();
    }
});

function addWorkspace(workspace) {
    workspaces[workspace.name] = workspace;
    displayWorkspaces();
}

const sections = document.querySelector("#sections");

function displayWorkspaces() {
    sections.innerHTML = "";
    for (let workspaceName in workspaces) {
        const workspace = workspaces[workspaceName];
        const container = document.createElement("div");
        container.className = "workspaceContainer";

        container.innerHTML = `
            <button class="workspace-title" data-workspace="${workspaceName}" style="border-left: 0.5rem ${workspace.color} solid">${workspaceName}</button>
            <div><button class="delete" data-workspace="${workspaceName}">x</button></div>
        `;
        sections.appendChild(container);
    }

    addWorkspaceEventListeners();
}

function addWorkspaceEventListeners() {
    const workspaceTitles = document.querySelectorAll(".workspace-title");
    workspaceTitles.forEach(title => {
        title.addEventListener("click", () => {
            currentWorkspace = title.getAttribute("data-workspace");
            displayTasks(currentWorkspace);
        });
    });

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const workspaceName = button.getAttribute("data-workspace");
            delete workspaces[workspaceName];
            displayWorkspaces();
            if (currentWorkspace === workspaceName) {
                currentWorkspace = null;
                inbox.innerHTML = "";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayWorkspaces();
});