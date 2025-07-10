const express = require("express");
const router = express.Router();
const Car = require("../model/Car");
const {
  authenticateToken,
  isAdmin,
  isAdminOrOperator,
} = require("../middleware/auth");

// ✅ CREATE - Criar novo carro (apenas admin)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ READ - Listar todos os carros (admin e operador)
router.get("/", authenticateToken, isAdminOrOperator, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ READ - Buscar carro por ID (admin e operador)
router.get(
  "/:carId",
  authenticateToken,
  isAdminOrOperator,
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

// ✅ UPDATE - Atualizar carro (apenas admin)
router.put("/:carId", authenticateToken, isAdmin, async (req, res) => {
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

// ✅ DELETE - Deletar carro (apenas admin)
router.delete("/:carId", authenticateToken, isAdmin, async (req, res) => {
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

module.exports = router;
