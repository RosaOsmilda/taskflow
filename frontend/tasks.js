const token = localStorage.getItem("taskflow_token");
const user = JSON.parse(localStorage.getItem("taskflow_user") || "null");

// Si no hay sesión, mandar de vuelta al login
if (!token || !user) {
  window.location.href = "index.html";
}

document.getElementById("userNameLabel").textContent = "Hola, " + (user ? user.name : "");

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_user");
  window.location.href = "index.html";
});

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskListMessage = document.getElementById("taskListMessage");
const filterStatus = document.getElementById("filterStatus");
const filterSort = document.getElementById("filterSort");

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
  };
}

// Si el token expiró o es inválido, regresa al login
function handleAuthError(res) {
  if (res.status === 401) {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    window.location.href = "index.html";
    return true;
  }
  return false;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

// ---------- CARGAR TAREAS ----------
async function loadTasks() {
  taskListMessage.textContent = "Cargando tareas...";
  taskListMessage.className = "form-message";
  taskList.innerHTML = "";

  const params = new URLSearchParams();
  if (filterStatus.value) params.append("status", filterStatus.value);
  if (filterSort.value) params.append("sort", filterSort.value);

  try {
    const res = await fetch(`${API_URL}/tasks?${params.toString()}`, {
      headers: authHeaders(),
    });
    if (handleAuthError(res)) return;

    const tasks = await res.json();

    if (!res.ok) {
      taskListMessage.textContent = tasks.error || "Error al cargar tareas";
      taskListMessage.className = "form-message error";
      return;
    }

    if (tasks.length === 0) {
      taskListMessage.textContent = "No tienes tareas todavía. ¡Agrega la primera!";
      return;
    }

    taskListMessage.textContent = "";
    tasks.forEach(renderTask);
  } catch (err) {
    taskListMessage.textContent = "No se pudo conectar con el servidor.";
    taskListMessage.className = "form-message error";
  }
}

// ---------- RENDERIZAR UNA TAREA ----------
function renderTask(task) {
  const li = document.createElement("li");
  li.className = `task-item priority-${task.priority || "media"} ${task.status === "completada" ? "completada" : ""}`;

  const dueDateText = formatDate(task.dueDate);

  li.innerHTML = `
    <div class="task-content">
      <p class="task-title">${escapeHtml(task.title)}</p>
      ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
      <div class="task-meta">
        <span class="badge priority-${task.priority || "media"}">${task.priority || "media"}</span>
        ${dueDateText ? `<span>📅 ${dueDateText}</span>` : ""}
        <span>${task.status === "completada" ? "✅ Completada" : "🕓 Pendiente"}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="complete-btn">${task.status === "completada" ? "Reabrir" : "Completar"}</button>
      <button class="delete-btn">Eliminar</button>
    </div>
  `;

  li.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(task));
  li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task._id));

  taskList.appendChild(li);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- CREAR TAREA ----------
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, description, priority, dueDate: dueDate || undefined }),
    });
    if (handleAuthError(res)) return;

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error al crear la tarea");
      return;
    }

    taskForm.reset();
    document.getElementById("taskPriority").value = "media";
    loadTasks();
  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
});

// ---------- COMPLETAR / REABRIR TAREA ----------
async function toggleComplete(task) {
  const newStatus = task.status === "completada" ? "pendiente" : "completada";
  try {
    const res = await fetch(`${API_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });
    if (handleAuthError(res)) return;
    loadTasks();
  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
}

// ---------- ELIMINAR TAREA ----------
async function deleteTask(id) {
  if (!confirm("¿Seguro que quieres eliminar esta tarea?")) return;
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (handleAuthError(res)) return;
    loadTasks();
  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
}

// ---------- FILTROS ----------
filterStatus.addEventListener("change", loadTasks);
filterSort.addEventListener("change", loadTasks);

// Carga inicial
loadTasks();
