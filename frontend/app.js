const API_BASE = "http://localhost:3001/api/tasks";
const API_BACKLOG = "http://localhost:3001/api/backlog";

const taskForm = document.getElementById("taskForm");
const msg = document.getElementById("msg");
const tasksList = document.getElementById("tasksList");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const toggleViewBtn = document.getElementById("toggleViewBtn");

let currentMode = "tasks"; // 'tasks' | 'backlog'

let cacheTasks = [];

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "#ffb4b4" : "";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
}

function render(tasks) {
  tasksList.innerHTML = "";
  emptyState.style.display = tasks.length ? "none" : "block";

  for (const t of tasks) {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <div class="task-top">
        <div>
          <div class="task-title">${escapeHtml(t.titulo)}</div>
          <div class="badges">
            <span class="badge">${escapeHtml(t.tecnologia)}</span>
            <span class="badge ${t.estado}">${t.estado === "done" ? "Completada" : "Pendiente"}</span>
            <span class="badge">${formatDate(t.fecha)}</span>
            ${t.fechaEliminacion ? `<span class="badge" style="color:#ffb4b4">Eliminada: ${formatDate(t.fechaEliminacion)}</span>` : ""}
          </div>
        </div>
        <div class="task-actions">
          ${currentMode === "tasks" ? `<button class="btn" data-action="delete" data-id="${t._id}">Borrar</button>` : ""}
        </div>
      </div>
      ${t.descripcion ? `<p class="task-desc">${escapeHtml(t.descripcion)}</p>` : ""}
    `;

    tasksList.appendChild(li);
  }
}

async function loadTasks() {
  try {
    setMsg("Cargando...");
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("No se pudieron cargar las tareas");
    cacheTasks = await res.json();
    render(cacheTasks);
    setMsg("");
  } catch (e) {
    setMsg(e.message, true);
  }
}

async function createTask(payload) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Error creando tarea");
  }
  return res.json();
}

async function removeTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Error borrando tarea");
  }
  return res.json();
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("");

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const tecnologia = document.getElementById("tecnologia").value;
  const estado = document.getElementById("estado").value;

  try {
    const created = await createTask({ titulo, descripcion, tecnologia, estado });

    // Actualiza UI sin recargar
    cacheTasks = [created, ...cacheTasks];
    render(cacheTasks);

    taskForm.reset();
    document.getElementById("tecnologia").value = "Otro";
    document.getElementById("estado").value = "pending";
    setMsg("✅ Tarea guardada");
  } catch (err) {
    setMsg(err.message, true);
  }
});

tasksList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action='delete']");
  if (!btn) return;

  const id = btn.dataset.id;

  try {
    btn.disabled = true;
    await removeTask(id);

    // Actualiza UI sin recargar
    cacheTasks = cacheTasks.filter(t => t._id !== id);
    render(cacheTasks);

    setMsg("🗑️ Tarea eliminada");
  } catch (err) {
    setMsg(err.message, true);
  } finally {
    btn.disabled = false;
  }
});

refreshBtn.addEventListener("click", () => {
  if (currentMode === "tasks") loadTasks();
  else loadBacklog();
});

toggleViewBtn.addEventListener("click", () => {
  if (currentMode === "tasks") {
    currentMode = "backlog";
    toggleViewBtn.textContent = "Ver Tareas Activas";
    document.querySelector(".list-header h2").textContent = "Historial";
    loadBacklog();
  } else {
    currentMode = "tasks";
    toggleViewBtn.textContent = "Ver Historial";
    document.querySelector(".list-header h2").textContent = "Tareas";
    loadTasks();
  }
});

async function loadBacklog() {
  try {
    setMsg("Cargando historial...");
    const res = await fetch(API_BACKLOG);
    if (!res.ok) throw new Error("No se pudo cargar el historial");
    cacheTasks = await res.json();
    render(cacheTasks);
    setMsg("");
  } catch (e) {
    setMsg(e.message, true);
  }
}

loadTasks();
