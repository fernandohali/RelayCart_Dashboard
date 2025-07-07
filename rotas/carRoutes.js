const express = require("express");
const router = express.Router();
const Car = require("../model/Car");

// CREATE - Criar um novo carro
router.post("/", async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Buscar todos os carros
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Buscar um carro por ID
router.get("/:carId", async (req, res) => {
  try {
    const car = await Car.findOne({ carId: req.params.carId });
    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Atualizar um carro
router.put("/:carId", async (req, res) => {
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

// DELETE - Deletar um carro
router.delete("/:carId", async (req, res) => {
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
