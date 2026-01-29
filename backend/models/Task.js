const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    tecnologia: { type: String, required: true, trim: true }, 
    estado: { type: String, enum: ["pending", "done"], default: "pending" },
    fecha: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Task", TaskSchema);
