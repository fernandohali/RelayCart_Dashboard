const express = require("express");
const router = express.Router();
const Session = require("../model/Session");

// CREATE - Criar nova sessão (admin e operador)
router.post("/", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Listar todas as sessões
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("car", "carId name")
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Buscar por ID
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("car", "carId name")
      .populate("user", "username email");
    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Atualizar sessão (admin e operador)
router.put("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("car", "carId name")
      .populate("user", "username email");

    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH - Finalizar sessão
router.patch("/:id/complete", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }

    if (session.status === "COMPLETED") {
      return res.status(400).json({ error: "Sessão já foi finalizada" });
    }

    session.endTime = new Date();
    session.durationSeconds = Math.round(
      (session.endTime - session.startTime) / 1000
    );
    session.status = "COMPLETED";
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate("car", "carId name")
      .populate("user", "username email");

    res.json(populatedSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Deletar sessão (opcional: pode restringir só para admin, se quiser)
router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }
    res.json({ message: "Sessão deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
