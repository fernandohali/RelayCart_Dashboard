// rotas/index.js
const router = require("express").Router();

const userRoutes = require("./userRoutes");
const carRoutes = require("./carRoutes");
const sessionRoutes = require("./sessionRoutes");
 // Se tiver mesmo esse

// Conecta subrotas
router.use("/users", userRoutes);
router.use("/cars", carRoutes);
router.use("/sessions", sessionRoutes);

// Teste raiz
router.get("/", (req, res) => {
  res.json({ message: "API funcionando 👌" });
});

module.exports = router;
