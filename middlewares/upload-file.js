const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// =======================
// STORAGE CONFIGURATION (CLOUDINARY)
// =======================
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = path.extname(file.originalname).slice(1);
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: isPdf
        ? "editable-portfolio-1/documents"
        : "editable-portfolio-1/images",

      public_id: `${baseName}-${Date.now()}`,

      resource_type: isPdf ? "raw" : "image",

      // Only apply transformations to images
      transformation: isPdf
        ? undefined
        : [{ quality: "auto", fetch_format: "auto" }],
    };
  },
});

// =======================
// FILE FILTER (SAFE VERSION)
// =======================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, GIF images and PDF files are allowed."
      )
    );
  }
};

// =======================
// MULTER INSTANCE
// =======================
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = upload;
