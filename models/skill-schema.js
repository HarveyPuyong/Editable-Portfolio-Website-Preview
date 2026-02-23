const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      default: "Enter Your Skill",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Skill", skillSchema);
