const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Chave secreta para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-muito-segura";

// Middleware para verificar token JWT
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Apenas o Admin pode acessar" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.user = user; // Adiciona o usuário à requisição
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Middleware para verificar se é admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Autenticação requerida" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso permitido apenas para administradores" });
  }
  next();
}

// Middleware para verificar se é admin ou operador
function isAdminOrOperator(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Autenticação requerida" });
  }

  if (req.user.role !== "admin" && req.user.role !== "operator") {
    return res
      .status(403)
      .json({
        error: "Acesso permitido apenas para administradores e operadores",
      });
  }
  next();
}

// Função para gerar token JWT
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

module.exports = {
  authenticateToken,
  isAdmin,
  isAdminOrOperator,
  generateToken,
  JWT_SECRET,
};
