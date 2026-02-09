const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

    title: {
      type: String,
      default: "Project Title",
      required: true,
      trim: true,
    },

    type: {
      type: String, 
      default: "project type",
      required: true,
      trim: true,
    },

    link: {
      type: String, 
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
