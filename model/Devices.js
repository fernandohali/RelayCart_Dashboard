const mongoose = require("mongoose");
const { Schema } = mongoose;


const deviceSchema = new Schema({
  nome: { type: String, required: true, unique: true },
  time: { type: Date, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
});

module.exports = mongoose.model("Devices", deviceSchema);
