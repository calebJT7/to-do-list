  // Chequear si está logueado, si no, redirigir
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "firstprojet.html";
} else {
  document.getElementById("userEmail").textContent = currentUser.email;
}

// LLaves para guardar en localStorage con user email
const TASKS_KEY = `tasks_${currentUser.email}`;
const NOTES_KEY = `notes_${currentUser.email}`;

// --- Tareas ---
let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

function addTask() {
  const input = document.getElementById("taskInput");
  const val = input.value.trim();
  if (!val) return;
  tasks.push({ text: val, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleComplete(${i})">${task.text}</span>
      <button onclick="deleteTask(${i})">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

renderTasks();

// --- Notas ---
let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];

function addNote() {
  const input = document.getElementById("noteInput");
  const val = input.value.trim();
  if (!val) return;
  notes.push(val);
  saveNotes();
  renderNotes();
  input.value = "";
}

function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = "";
  notes.forEach((note, i) => {
    const li = document.createElement("li");
    li.textContent = note;
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.onclick = () => {
      notes.splice(i, 1);
      saveNotes();
      renderNotes();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

renderNotes();

// --- Logout ---
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "firstprojet.html";
}


 
