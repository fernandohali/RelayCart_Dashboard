const mongoose = require("mongoose");

// ==================== ATENÇÃO ====================
// O OPERADOR inicia, monitora e encerra sessões de uso.
// O ADMIN define os valores e tempos que o operador vai usar.
// =================================================

const sessionSchema = new mongoose.Schema(
  {
    // Referência ao carro usado na sessão
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // Referência ao usuário que iniciou a sessão
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Horário de início
    startTime: {
      type: Date,
      default: Date.now,
    },

    // Horário de término
    endTime: {
      type: Date,
    },

    // Duração total em segundos (deve ser calculada na lógica)
    durationSeconds: {
      type: Number,
      default: 0,
    },

    // Minutos contratados (vem do valor definido pelo ADMIN)
    initialMinutes: {
      type: Number,
      required: true,
    },

    // Status atual da sessão
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ABORTED", "TIMED_OUT"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

sessionSchema.index({ car: 1, user: 1 });

module.exports = mongoose.model("Session", sessionSchema);
