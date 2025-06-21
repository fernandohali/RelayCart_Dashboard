const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

// Rotas da API
const api = require("./rotas");
app.use("/api", api);

// Produção: servir frontend React
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Inicia servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
