const router = require("express").Router();
const Devices = require("../model/Devices");

router.get("/", async (req, res) => {
  try {
    const listDevices = await Devices.find();
    res.json(listDevices);
  } catch (err) {
    console.error("Erro ao buscar dispositivos:", err);
    res.status(500).json({ message: "Erro ao buscar dispositivos." });
  }
});

router.post("/", async (req, res) => {
  const device = new Devices({
    nome: req.body.nome, // ← nome no schema, name na entrada
    time: req.body.time,
    status: req.body.status,
  });

  console.log("Dispositivo recebido:", device);

  try {
    const saveNovoDevice = await device.save();
    res.json({
      success: true,
      message: saveNovoDevice,
    });
  } catch (err) {
    console.error("Erro ao salvar novo dispositivo:", err);
    res.status(500).json({
      success: false,
      message: "Não foi possível gravar o novo device",
      error: err.message, // mostra no cliente
      details: err.errors, // validações do Mongoose
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const upDevice = await Devices.updateOne(
      { _id: req.params.id },
      { time: req.body.time, status: req.body.status }
    );
    res.json({
      success: true,
      updated: upDevice.nmodified,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Não foi possível a atualização",
    });
  }
});

module.exports = router;
