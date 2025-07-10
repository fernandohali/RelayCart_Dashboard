const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { generateToken } = require("../middleware/auth");

// ✅ CREATE - Criar novo usuário
router.post("/", async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ error: "A senha é obrigatória" });
    }

    // Copia dados do body
    const userData = { ...req.body };
    delete userData.password; // Remove senha do objeto principal

    const user = new User(userData);

    // Define a senha virtual para gerar hash
    user.password = req.body.password;

    // Salva ignorando validação inicial para gerar o hash primeiro
    await user.save({ validateBeforeSave: false });

    // Prepara resposta sem hash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse._password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ READ - Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ READ - Buscar um usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE - Atualizar um usuário
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (req.body.password) {
      user.password = req.body.password;
      delete req.body.password;
    }

    Object.assign(user, req.body);

    await user.save({ validateBeforeSave: false });

    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse._password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE - Deletar um usuário
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ LOGIN - Verificar credenciais
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username e senha são obrigatórios" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    // Gerar token JWT real
    const token = generateToken(user._id);

    res.json({
      message: "Login realizado com sucesso",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
