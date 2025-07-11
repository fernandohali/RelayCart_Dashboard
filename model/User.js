const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Cria o schema do usuário
const userSchema = new mongoose.Schema(
  {
    // Nome de usuário único (login)
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // remove espaços extras
    },

    // Hash da senha (nunca salva a senha em texto puro)
    passwordHash: {
      type: String,
      required: true,
    },

    // E-mail do usuário
    email: {
      type: String,
      required: true,
      trim: true, // remove espaços
      lowercase: true, // força minúsculo
      match: [/.+\@.+\..+/, "Email inválido"], // valida formato
    },

    // Função do usuário: admin ou operador
    role: {
      type: String,
      // O admin é o dono do sistema, gestor é quem controla os carros
      // e o operador é quem controla o estado dos carros
      enum: ["admin", "gestor", "operator"], // só pode ser um desses valores
      default: "operator",
    },
  },
  {
    timestamps: true, // cria createdAt e updatedAt automaticamente
  }
);

// Virtual para receber a senha em texto puro antes de salvar
userSchema.virtual("password").set(function (password) {
  this._password = password; // armazena a senha temporariamente
  this.passwordHash = undefined; // limpa o hash anterior (se houver)
});

// Middleware que roda antes de salvar o usuário
userSchema.pre("save", async function (next) {
  // Se não foi definida uma nova senha, segue adiante
  if (!this._password) return next();

  try {
    // Gera o salt para o hash
    const salt = await bcrypt.genSalt(10);
    // Cria o hash da senha e salva em passwordHash
    this.passwordHash = await bcrypt.hash(this._password, salt);
    next();
  } catch (err) {
    next(err); // em caso de erro
  }
});

// Método para comparar senha informada com o hash salvo
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Exporta o modelo
module.exports = mongoose.model("User", userSchema);
