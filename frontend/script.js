const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    fetch("http://localhost:3000/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: taskText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create task");
        }
        return response.json();
      })
      .then((data) => {
        const taskItem = createTaskElement(data.description);
        taskList.appendChild(taskItem);
        taskInput.value = "";
        getAllTasks();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  }
}

// createTaskElement function
function createTaskElement(text, taskId) {
  const centerRow = document.createElement("div");
  centerRow.classList.add("row");
  centerRow.classList.add("center-row");
  centerRow.classList.add("mb-3");

  const taskItem = document.createElement("div");
  taskItem.classList.add("task");
  taskItem.classList.add("col-md-7"); // Adjust the width for the task text

  const taskText = document.createElement("h4");
  taskText.innerText = text;
  taskText.style.textAlign = "left";
  taskText.classList.add("text-light");
  taskText.classList.add("task-text"); // Assigning class "task-text"
  taskItem.appendChild(taskText);

  // Create checkbox for marking task as complete
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("form-check-input");
  checkbox.style.width = "20px";
  checkbox.style.height = "20px";
  checkbox.addEventListener("change", () => toggleTaskCompletion(centerRow));

  const label = document.createElement("label");
  label.classList.add("form-check-label");

  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("col-md-1");
  checkboxContainer.classList.add("form-check");
  checkboxContainer.appendChild(checkbox);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("col-md-4");
  buttonContainer.style.textAlign = "right";

  const editButton = createButton("Edit", () => editTask(taskText));
  editButton.classList.add("edit-button"); // Assigning class "edit-button"
  const deleteButton = createButton("Delete", () => deleteTask(taskId));

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  centerRow.appendChild(checkboxContainer);
  centerRow.appendChild(taskItem);
  centerRow.appendChild(buttonContainer);

  // Set the task ID as a data attribute
  centerRow.dataset.taskId = taskId;

  return centerRow;
}

// Function to create a button
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add(
    text === "Delete"
      ? "btn-danger"
      : text === "Edit"
      ? "btn-warning"
      : "btn-success"
  );
  button.classList.add("mx-2");
  button.innerText = text;
  button.addEventListener("click", onClick);
  return button;
}

// Function to mark task as completed
function toggleTaskCompletion(centerRow) {
  // Toggle the 'completed' class of the centerRow
  centerRow.classList.toggle("completed");

  // Find the edit button and task text elements within the centerRow
  const editButton = centerRow.querySelector(".edit-button");
  const taskText = centerRow.querySelector(".task-text");

  // Extract the task ID from the dataset
  const taskId = centerRow.dataset.taskId;

  // Send a PUT request to the backend to update the task completion status
  fetch(`http://localhost:3000/tasks/complete/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: centerRow.classList.contains("completed"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update task completion status");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response if needed
    })
    .catch((error) => {
      console.error("Error updating task completion status:", error);
    });

  // Update the visual representation of the task completion status
  if (centerRow.classList.contains("completed")) {
    editButton.disabled = true;
    taskText.style.textDecoration = "line-through";
  } else {
    editButton.disabled = false;
    taskText.style.textDecoration = "none";
  }
}

// Function to create a button
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add(
    text === "Delete"
      ? "btn-danger"
      : text === "Edit"
      ? "btn-warning"
      : "btn-success"
  );
  button.classList.add("mx-2");
  button.innerText = text;
  button.addEventListener("click", onClick);
  return button;
}

// Function to edit task
function editTask(taskText) {
  const newText = prompt("Edit task:", taskText.innerText);
  if (newText !== null) {
    taskText.innerText = newText.trim();
  }
}

// Function to delete task
// Function to delete a task
function deleteTask(taskID) {
  fetch(`http://localhost:3000/tasks/${taskID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
    })
    .then(() => {
      const taskItem = document.querySelector(`[data-task-id="${taskID}"]`);
      taskItem.remove();
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
}

// Function to fetch all tasks and display them on page load
function getAllTasks() {
  taskList.innerHTML = "";

  fetch("http://localhost:3000/tasks/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((task) => {
        const taskItem = createTaskElement(task.description, task._id);
        if (task.completed) {
          taskItem.classList.add("completed");
          const editButton = taskItem.querySelector(".edit-button");
          const taskText = taskItem.querySelector(".task-text");
          editButton.disabled = true;
          taskText.style.textDecoration = "line-through";
        }
        taskList.appendChild(taskItem);

        // Update the checkbox state
        const checkbox = taskItem.querySelector(".form-check-input");
        checkbox.checked = task.completed;
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

// Call getAllTasks when the page loads
window.addEventListener("load", getAllTasks);
