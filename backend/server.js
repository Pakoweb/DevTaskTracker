require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Task = require("./models/Task");
const Backlog = require("./models/Backlog");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

// Ruta base
app.get("/", (req, res) => res.send("DevTask Tracker API OK ✅"));

/**
 * GET /api/tasks
 * Devuelve todas las tareas
 */
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ fecha: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error leyendo tareas", error: err.message });
  }
});

/**
 * POST /api/tasks
 * Crea una nueva tarea
 * Body: { titulo, descripcion, tecnologia, estado }
 */
app.post("/api/tasks", async (req, res) => {
  try {
    const { titulo, descripcion, tecnologia, estado } = req.body;

    if (!titulo || !tecnologia) {
      return res.status(400).json({ message: "titulo y tecnologia son obligatorios" });
    }

    const created = await Task.create({
      titulo,
      descripcion: descripcion ?? "",
      tecnologia,
      estado: estado ?? "pending"
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Error creando tarea", error: err.message });
  }
});

/**
 * DELETE /api/tasks/:id
 * Elimina una tarea y la guarda en Backlog (histórico)
 */
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Guardar copia en Backlog
    await Backlog.create({
      originalId: task._id.toString(),
      titulo: task.titulo,
      descripcion: task.descripcion,
      tecnologia: task.tecnologia,
      estado: task.estado,
      fechaCreacion: task.fecha
    });

    // Eliminar de Tasks
    await Task.deleteOne({ _id: id });

    res.json({ message: "Tarea eliminada y archivada en Backlog" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando tarea", error: err.message });
  }
});

/**
 * GET /api/backlog
 * Devuelve todas las tareas eliminadas (histórico)
 */
app.get("/api/backlog", async (req, res) => {
  try {
    const logs = await Backlog.find().sort({ fechaEliminacion: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error leyendo historial", error: err.message });
  }
});

async function start() {
  try {
    console.log("🔌 Conectando a MongoDB Atlas...");
    if (!process.env.MONGODB_URI) throw new Error("Falta MONGODB_URI en .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`🚀 Server en http://localhost:${port}`));
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

start();
