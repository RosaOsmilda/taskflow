const express = require("express");
const Task = require("../models/Task");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de tareas requieren estar autenticado
router.use(requireAuth);

// GET /tasks -> lista tareas del usuario, con filtro y orden (HU-08, HU-09)
// Query params opcionales: ?status=pendiente&sort=dueDate  (o sort=priority)
router.get("/", async (req, res) => {
  try {
    const { status, sort } = req.query;
    const query = { owner: req.userId };
    if (status) query.status = status;

    let sortOption = { createdAt: -1 };
    if (sort === "dueDate") sortOption = { dueDate: 1 };
    if (sort === "priority") sortOption = { priority: 1 };

    const tasks = await Task.find(query).sort(sortOption);
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// POST /tasks -> crea tarea (HU-03), incluye prioridad y fecha límite (HU-07)
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      owner: req.userId,
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: "Error al crear la tarea" });
  }
});

// PUT /tasks/:id -> edita tarea (HU-04), o marca como completada (HU-06)
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

// DELETE /tasks/:id -> elimina tarea (HU-05)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.json({ message: "Tarea eliminada correctamente" });
  } catch (err) {
    return res.status(500).json({ error: "Error al eliminar la tarea" });
  }
});

module.exports = router;
