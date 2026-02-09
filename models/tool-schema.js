const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      default: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
      required: false,
    },

    imgPublicId: {
      type: String,
      default: "default/default-image_cca1xk",
      required: false,
    },

    name: {
      type: String,
      default: "Tool Name",
      required: true,
      trim: true,
    },

    details: {
      type: String,
      default: "About this tool",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tool", toolSchema);
