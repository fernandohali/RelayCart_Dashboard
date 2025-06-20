const router = require("express").Router(); // cria o roteador
require("../mongoDB/mongoconn");
const devices = require("./devices");
router.use("/devices", devices);

router.get("/", (req, res) => {
  res.json({ message: "Este é um acesso reservado" });
});

module.exports = router;
