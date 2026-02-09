const ToolDB = require("../models/tool-schema");
const cloudinary = require("../config/cloudinary");

// =======================
// GET ALL TOOLS
// =======================
const getTools = async (req, res) => {
  try {
    const tools = await ToolDB.find().sort({ createdAt: 1 });
    res.status(200).json({ tools });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get tools." });
  }
};

// =======================
// ADD TOOL
// =======================
const addTool = async (req, res) => {
  try {
    const maxTool = 20;
    const count = await ToolDB.countDocuments();

    if (count >= maxTool) return res.status(400).json({message: `Cannot add more than ${maxTool} tools.`});
    

    const { name, details } = req.body;

    let img = undefined
    let imgPublicId = undefined;
    
    if (req.file) {
      img = req.file.path;             // Cloudinary URL
      imgPublicId = req.file.filename; // Cloudinary public_id
    }

    const tool = await ToolDB.create({
      name,
      details,
      img,
      imgPublicId,
    });

    res.status(201).json({
      message: "Tool added successfully.",
      tool,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add tool." });
  }
};

// =======================
// EDIT TOOL
// =======================
const editTool = async (req, res) => {
  try {
    const { id } = req.params;
    const tool = await ToolDB.findById(id);

    if (!tool)
      return res.status(404).json({ message: "Tool not found." });

    if (req.file) {
      if (tool.imgPublicId) {
        await cloudinary.uploader.destroy(tool.imgPublicId);
      }

      tool.img = req.file.path;
      tool.imgPublicId = req.file.filename;
    }

    if (req.body.name !== undefined) tool.name = req.body.name;
    if (req.body.details !== undefined) tool.details = req.body.details;

    await tool.save();

    res.status(200).json({
      message: "Tool updated successfully.",
      tool,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update tool." });
  }
};

// =======================
// DELETE TOOL
// =======================
const deleteTool = async (req, res) => {
  try {
    const tool = await ToolDB.findById(req.params.id);
    if (!tool)
      return res.status(404).json({ message: "Tool not found." });

    if (tool.imgPublicId) {
      await cloudinary.uploader.destroy(tool.imgPublicId);
    }

    await tool.deleteOne();

    res.status(200).json({
      message: "Tool deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete tool." });
  }
};

module.exports = {
  getTools,
  addTool,
  editTool,
  deleteTool,
};
