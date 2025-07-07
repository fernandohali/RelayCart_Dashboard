const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    carId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      enum: ["READY", "RUNNING", "TOLERANCE", "STOPPED"],
      default: "READY",
    },
    remainingTime: {
      type: Number,
      default: 0,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    lastHeartbeatAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

carSchema.index({ carId: 1 });

module.exports = mongoose.model("Car", carSchema);
