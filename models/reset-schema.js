// models/reset-model.js
const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema(
  {
    resetTime: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reset", resetSchema);
