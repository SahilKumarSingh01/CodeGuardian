// controllers/software/sellerController.js
import Software from "../../models/Software.js";

export const uploadSoftware = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid type" });
    }

    const { title, description, version, price } = req.body;

    // Store only publicId and size
    const software = await Software.create({
      title,
      description,
      version,
      price,
      publicId: req.file.filename, // Cloudinary public_id
      size: req.file.size,         // File size in bytes
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: "Software uploaded successfully",
      software,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyUploads = async (req, res) => {
  try {
    const softwares = await Software.find({ uploadedBy: req.user.id });
    res.json(softwares);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
