const mongoose = require("mongoose");

// ==================== ATENÇÃO ====================
// Somente ADMIN pode criar, editar ou excluir carros.
// O OPERADOR não pode cadastrar ou excluir carros!
// O OPERADOR apenas controla o estado do carro (READY, RUNNING, STOPPED).
// O preço por minuto e o tempo inicial são definidos pelo ADMIN.
// =================================================

const carSchema = new mongoose.Schema(
  {
    // ID único do carro
    carId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Nome do carro
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Vai ser as imagens do carro
    images: {
      type: [String],
      required: true,
    },

    // Estado do carro: pronto, em movimento ou parado
    state: {
      type: String,
      enum: ["READY", "RUNNING", "STOPPED"],
      default: "STOPPED",
    },

    // Tempo restante em segundos
    remainingTime: {
      type: Number,
      default: 0,
    },

    // Preço por minuto (definido pelo ADMIN)
    pricePerMinute: {
      type: Number,
      default: 1,
    },

    // Valor total calculado com base no tempo
    totalValue: {
      type: Number,
      default: 0,
    },
  },
  { collection: "cars", timestamps: true }
);

carSchema.index({ carId: 1 });

// Método para calcular o valor total (admin pode usar para relatórios)
carSchema.methods.calculateTotalValue = function () {
  const minutes = Math.ceil(this.remainingTime / 60);
  this.totalValue = minutes * this.pricePerMinute;
  return this.totalValue;
};

module.exports = mongoose.model("Car", carSchema);
