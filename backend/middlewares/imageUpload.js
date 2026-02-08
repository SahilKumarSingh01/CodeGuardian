// middleware/imageUploadMiddleware.js
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Storage engine for images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ticket_chats",
    resource_type: "image",
    type: "authenticated",
    format: "webp", // force webp
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "limit",       // keeps aspect ratio
        quality: "auto:eco", // aggressive compression
        fetch_format: "webp" // force webp delivery
      }
    ],
  },
});

// File filter: only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer upload instance
const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

export default imageUpload;
