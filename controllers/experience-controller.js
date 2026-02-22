const ExperienceDB = require("../models/experience-schema");
const cloudinary = require("../config/cloudinary");

// =======================
// GET ALL EXPERIENCES
// =======================
const getExperiences = async (req, res) => {
  try {
    const experiences = await ExperienceDB.find().sort({ createdAt: 1 });
    res.status(200).json({ experiences });
  } catch (err) {
    res.status(500).json({ message: "Failed to get experiences." });
  }
};

// =======================
// ADD EXPERIENCE
// =======================
const addExperience = async (req, res) => {
  try {
    const maxExperience = 8;
    const count = await ExperienceDB.countDocuments();
    
    if (count >= maxExperience) {
      return res.status(400).json({
        message: `Cannot add more than ${maxExperience} experience.`,
      });
    }

    const { title, company, dateRange, details } = req.body;

    let img = undefined
    let imgPublicId = undefined;
    
    if (req.file) {
      img = req.file.path;             // Cloudinary URL
      imgPublicId = req.file.filename; // Cloudinary public_id
    }
    
    const experience = await ExperienceDB.create({
      title,
      company,
      dateRange,
      details,
      img,
      imgPublicId,
    });

    res.status(201).json({
      message: "Experience added successfully",
      experience,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add experience." });
  }
};

// =======================
// EDIT EXPERIENCE
// =======================
const editExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await ExperienceDB.findById(id);

    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    if (req.file) {
      // delete old image
      if (experience.imgPublicId) {
        await cloudinary.uploader.destroy(experience.imgPublicId);
      }

      experience.img = req.file.path;
      experience.imgPublicId = req.file.filename;
    }

    Object.assign(experience, req.body);
    await experience.save();

    res.json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update experience." });
  }
};

// =======================
// DELETE EXPERIENCE
// =======================
const deleteExperience = async (req, res) => {
  try {
    const experience = await ExperienceDB.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    if (experience.imgPublicId) {
      await cloudinary.uploader.destroy(experience.imgPublicId);
    }

    await experience.deleteOne();

    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete experience." });
  }
};

module.exports = {
  getExperiences,
  addExperience,
  editExperience,
  deleteExperience,
};
