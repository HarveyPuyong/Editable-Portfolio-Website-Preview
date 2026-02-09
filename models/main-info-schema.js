const mongoose = require("mongoose");

const mainInfoSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263038/default-profile-img_tayqnl.png",
      required: false,
    },

    profileImagePublicId: {
      type: String,
      default: "default/default-profile-img_tayqnl",
      required: false,
    },

    workAvailability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "unavailable",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    cvFile: {
      type: String,
      default: null,
    },

    cvFilePublicId: {
      type: String,
      default: null,
    },

    aboutMe: {
      type: String,
      default: "",
    },

    contactNumber: {
      type: String,
      default: "No contact no.",
    },

    address: {
      type: String,
      default: "No Address",
    },

    instagramLink: {
      type: String,
      default: "#",
    },

    tiktokLink: {
      type: String,
      default: "#",
    },

    youtubeLink: {
      type: String,
      default: "#",
    },

    facebookLink: {
      type: String,
      default: "#",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MainInfo", mainInfoSchema);
