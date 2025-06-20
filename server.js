const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(bodyParser.json());

// Conectar no MongoDB (leia a variável MONGO_CONNECT do seu .env)
mongoose.connect(process.env.MONGO_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado ao MongoDB"))
.catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

// Importar rotas
const api = require("./rotas"); // rotas/index.js
app.use("/api", api);

// Rota teste
app.get("/", (_req, res) => res.json({ message: "Hello, World!" }));

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
