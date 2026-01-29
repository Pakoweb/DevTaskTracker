const mongoose = require("mongoose");

const BacklogSchema = new mongoose.Schema(
  {
    originalId: { type: String, required: true },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    tecnologia: { type: String, required: true, trim: true },
    estado: { type: String, required: true },
    fechaCreacion: { type: Date, required: true },
    fechaEliminacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Backlog", BacklogSchema);
