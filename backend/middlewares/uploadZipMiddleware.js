// middleware/uploadMiddleware.js
import multer from "multer";
import cloudinary from "../config/cloudinary.js"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

// Storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "software",
    resource_type: "raw",
    type: "authenticated", 
  },
});


// File filter: only allow .zip
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".zip") {
    cb(null, true);
  } else {
    cb(new Error("Only .zip files are allowed"), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
});

export default upload;
