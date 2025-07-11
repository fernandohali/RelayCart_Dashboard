const express = require("express");
const router = express.Router();
const Car = require("../model/Car");
const {
  authenticateToken,
  isAdmin,
  isGestor,
  isGestorOrOperator,
  isOperator,
} = require("../middleware/auth");

// ✅ CREATE - Criar novo carro (apenas gestor)
router.post("/", authenticateToken, isGestor, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ READ - Listar todos os carros (gestor e operador)
router.get("/", authenticateToken, isGestorOrOperator, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ READ - Buscar carro por ID (gestor e operador)
router.get(
  "/:carId",
  authenticateToken,
  isGestorOrOperator,
  async (req, res) => {
    try {
      const car = await Car.findOne({ carId: req.params.carId });
      if (!car) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ UPDATE - Atualizar carro (apenas gestor)
router.put("/:carId", authenticateToken, isGestor, async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      { carId: req.params.carId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE - Deletar carro (apenas gestor)
router.delete("/:carId", authenticateToken, isGestor, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ carId: req.params.carId });
    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.json({ message: "Carro deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE - Atualizar apenas estado do carro (operador)
router.patch(
  "/:carId/status",
  authenticateToken,
  isOperator,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório" });
      }

      const car = await Car.findOneAndUpdate(
        { carId: req.params.carId },
        { status: status },
        { new: true, runValidators: true }
      );

      if (!car) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      res.json(car);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
