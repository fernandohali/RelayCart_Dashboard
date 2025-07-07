const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      // Dica: Atualize este valor na lógica de negócio (service/controller)
    },
    initialMinutes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ABORTED", "TIMED_OUT"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Índice para buscas rápidas
sessionSchema.index({ car: 1, user: 1 });

module.exports = mongoose.model("Session", sessionSchema);
