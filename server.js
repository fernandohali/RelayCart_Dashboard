const express = require("express");
require("dotenv").config();
const cors = require("cors"); 

// Conexão MongoDB
require("./mongoDB/mongoconn");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Habilite o CORS aqui
app.use(
  cors({
    origin: "http://localhost:5173", // Seu frontend Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Se usar cookies/sessões
  })
);

// Middleware JSON
app.use(express.json());

// Rotas da API
const api = require("./rotas");
app.use("/api", api);

// Servir frontend React em produção
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
