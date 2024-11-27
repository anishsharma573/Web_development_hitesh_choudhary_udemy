document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.querySelector('.add-task-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
  
    // Load tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Render existing tasks on page load
    tasks.forEach((task) => renderTask(task));
  
    // Add task button click event
    addTaskButton.addEventListener('click', () => {
      const taskText = todoInput.value.trim();
      if (taskText === '') return;
  
      const newTask = {
        id: Date.now(), // Unique ID for each task
        text: taskText,
        completed: false, // Task completion status
      };
  
      tasks.push(newTask); // Add new task to the tasks array
      saveTasks(); // Save tasks to localStorage
      renderTask(newTask); // Render the new task
      todoInput.value = ''; // Clear the input field
    });
  
    // Function to save tasks to localStorage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Function to render a task
    function renderTask(task) {
      const li = document.createElement('li');
      li.setAttribute('data-id', task.id);
  
      li.innerHTML = `
        <span>${task.text}</span>
        <button>Delete</button>
      `;
  
      // Delete button functionality
      li.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event propagation
        tasks = tasks.filter((t) => t.id !== task.id); // Remove task from the array
        saveTasks(); // Save updated tasks to localStorage
        li.remove(); // Remove task from the DOM
      });
  
      todoList.appendChild(li); //M
    }
  });
  