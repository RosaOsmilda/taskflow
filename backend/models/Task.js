const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    priority: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pendiente", "completada"],
      default: "pendiente",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
