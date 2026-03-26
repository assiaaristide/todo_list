const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");

const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const remainingTasksEl = document.getElementById("remaining-tasks");

const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Sauvegarder dans localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Mettre à jour les statistiques
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const remaining = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  remainingTasksEl.textContent = remaining;
}

// Afficher les tâches
function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="toggle-checkbox" />
        <span class="todo-text">${todo.text}</span>
      </div>
      <div class="todo-actions">
        <button class="icon-btn delete-btn" data-id="${todo.id}">🗑️</button>
      </div>
    `;

    todoList.appendChild(li);
  });

  updateStats();
}

// Ajouter une tâche
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.unshift(newTodo);
  saveTodos();
  renderTodos();
}

// Basculer état terminé / non terminé
function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

// Supprimer une tâche
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Soumission du formulaire
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = todoInput.value.trim();

  if (text === "") {
    alert("Veuillez entrer une tâche.");
    return;
  }

  addTodo(text);
  todoInput.value = "";
  todoInput.focus();
});

// Gestion des clics sur la liste
todoList.addEventListener("click", function (e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  }
});

todoList.addEventListener("change", function (e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("toggle-checkbox")) {
    toggleTodo(id);
  }
});

// Supprimer les tâches terminées
clearCompletedBtn.addEventListener("click", function () {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

// Tout supprimer
clearAllBtn.addEventListener("click", function () {
  const confirmDelete = confirm("Voulez-vous vraiment tout supprimer ?");
  if (confirmDelete) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

// Chargement initial
renderTodos();