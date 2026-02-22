const ProjectDB = require("../models/project-schema");
const cloudinary = require("../config/cloudinary");

// =======================
// GET ALL PROJECTS
// =======================
const getProjects = async (req, res) => {
  try {
    const projects = await ProjectDB.find().sort({ createdAt: 1 });
    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get projects." });
  }
};

// =======================
// ADD PROJECT
// =======================
const addProject = async (req, res) => {
  try {
    const maxProjects = 10;
    const count = await ProjectDB.countDocuments();

    if (count >= maxProjects) {
      return res.status(400).json({
        message: `Cannot add more than ${maxProjects} projects.`,
      });
    }

    const { title, type, link } = req.body;

    let img = undefined;
    let imgPublicId = undefined;

    if (req.file) {
      img = req.file.path; // Cloudinary URL
      imgPublicId = req.file.filename; // Cloudinary public_id
    }

    const project = await ProjectDB.create({
      title,
      type,
      link,
      img,
      imgPublicId,
    });

    res.status(201).json({
      message: "Project added successfully.",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add project." });
  }
};

// =======================
// EDIT PROJECT
// =======================
const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectDB.findById(id);

    if (!project)
      return res.status(404).json({ message: "Project not found." });

    if (req.file) {
      // delete old image
      if (project.imgPublicId) {
        await cloudinary.uploader.destroy(project.imgPublicId);
      }

      project.img = req.file.path;
      project.imgPublicId = req.file.filename;
    }

    if (req.body.title !== undefined) project.title = req.body.title;
    if (req.body.type !== undefined) project.type = req.body.type;
    if (req.body.link !== undefined) project.link = req.body.link;

    await project.save();

    res.status(200).json({
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project." });
  }
};

// =======================
// DELETE PROJECT
// =======================
const deleteProject = async (req, res) => {
  try {
    const project = await ProjectDB.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found." });

    if (project.imgPublicId) {
      await cloudinary.uploader.destroy(project.imgPublicId);
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project." });
  }
};

module.exports = {
  getProjects,
  addProject,
  editProject,
  deleteProject,
};
