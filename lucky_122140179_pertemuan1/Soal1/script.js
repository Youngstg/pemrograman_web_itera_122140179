// Selecting DOM elements
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const currentDateElement = document.getElementById('currentDate');

// Array to store todo items
let todos = [];

// Format and display current date
function displayCurrentDate() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const now = new Date();
    const dayName = daysOfWeek[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    currentDateElement.textContent = `${dayName}, ${date} ${month} ${year}`;
}

// Load todos from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    loadTodos();
    renderTodos();
    updateTaskCount();
});

// Add event listener to add button
addButton.addEventListener('click', addTodo);

// Add event listener for Enter key on input field
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Function to add a new todo
function addTodo() {
    const todoText = todoInput.value.trim();
    
    // Validate input
    if (todoText === '') {
        return;
    }
    
    // Create new todo object
    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };
    
    // Add to todos array
    todos.push(todo);
    
    // Update localStorage
    saveTodos();
    
    // Clear input field
    todoInput.value = '';
    
    // Render todos and update count
    renderTodos();
    updateTaskCount();
}

// Function to toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    // Update localStorage
    saveTodos();
    
    // Render todos and update count
    renderTodos();
    updateTaskCount();
}

// Function to delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    // Update localStorage
    saveTodos();
    
    // Render todos and update count
    renderTodos();
    updateTaskCount();
}

// Function to render todos
function renderTodos() {
    // Clear the list
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        // If no todos, show a placeholder message
        const placeholder = document.createElement('p');
        placeholder.className = 'add-task-placeholder';
        placeholder.textContent = 'Your task list is empty';
        todoList.appendChild(placeholder);
        return;
    }
    
    // Create list items for each todo
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        // Create todo text
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });
        
        // Append elements to list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        // Add click event to the text to toggle completion as well
        span.addEventListener('click', () => toggleTodo(todo.id));
        
        // Append list item to todo list
        todoList.appendChild(li);
    });
}

// Function to update task count
function updateTaskCount() {
    const remainingTasks = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = remainingTasks;
}

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to load todos from localStorage
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}