const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
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
      default: "Title",
      required: true,
      trim: true,
    },

    company: {
      type: String,
      default: "Company or etc..",
      required: true,
      trim: true,
    },

    dateRange: {
      type: String, // e.g. "Jan 2023 - Present",
      default: "2025 - Present",
      required: true,
    },

    details: {
      type: String,
      default: "Experience Details",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Experience", experienceSchema);
