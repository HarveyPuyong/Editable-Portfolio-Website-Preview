const mainInfoDB = require("../models/main-info-schema");
const UserDB = require('../models/user-schema');
const cloudinary = require("../config/cloudinary");

// =======================
// CHANGE INFO
// =======================
const changeInfo = async (req, res) => {
  try {
    const {
      name,
      workAvailability,
      aboutMe,
      contactNumber,
      address,
      instagramLink,
      tiktokLink,
      youtubeLink,
      facebookLink,
    } = req.body;

    const existingInfo = await mainInfoDB.findOne();

    // =======================
    // HANDLE PROFILE IMAGE
    // =======================
    let profileImage = existingInfo?.profileImage || null || undefined;
    let profileImagePublicId = existingInfo?.profileImagePublicId || null || undefined;

    if (req.files?.profileImage) {
      const uploadedImage = req.files.profileImage[0];

      // Delete old image from Cloudinary if not default
      if (profileImagePublicId) await cloudinary.uploader.destroy(profileImagePublicId);

      profileImage = uploadedImage.path;          // Cloudinary URL
      profileImagePublicId = uploadedImage.filename; // Cloudinary public_id
    }

    // =======================
    // HANDLE CV FILE
    // =======================
    let cvFile = existingInfo?.cvFile || null;
    let cvFilePublicId = existingInfo?.cvFilePublicId || null;

    if (req.files?.cvFile) {
      const uploadedFile = req.files.cvFile[0];

      // Delete old file from Cloudinary if exists
      if (cvFilePublicId) await cloudinary.uploader.destroy(cvFilePublicId, { resource_type: "raw" });

      cvFile = uploadedFile.path;
      cvFilePublicId = uploadedFile.filename;
    }

    // =======================
    // UPDATE DATABASE
    // =======================
    const updatedInfo = await mainInfoDB.findOneAndUpdate(
      {},
      {
        name,
        aboutMe,
        contactNumber,
        address,
        workAvailability,
        instagramLink,
        tiktokLink,
        youtubeLink,
        facebookLink,
        profileImage,
        profileImagePublicId,
        cvFile,
        cvFilePublicId,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Main info updated successfully.",
      info: updatedInfo,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update main info." });
  }
};

// =======================
// GET INFO
// =======================
const getInfo = async (req, res) => {
  try {
    const info = await mainInfoDB.findOne(); 
    const user = await UserDB.findOne().select("email -_id"); 

    res.status(200).json({
      info,
      email: user ? user.email : null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error: Cannot get info" });
  }
};

// =======================
// CHANGE EMAIL
// =======================
const changeEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const updatedEmail = await UserDB.findOneAndUpdate(
      {},
      { email },
      { new: true }
    ).select("email");

    res.status(200).json({
      email: updatedEmail.email,
      message: "Email updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update email." });
  }
};

module.exports = { changeInfo, getInfo, changeEmail };
