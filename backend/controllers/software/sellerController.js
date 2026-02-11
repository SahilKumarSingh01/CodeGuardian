// controllers/software/sellerController.js
import Software from "../../models/Software.js";
import { extractYouTubeEmbed } from "../../utils/youtube.js";
import cloudinary from "../../config/cloudinary.js";
import RefData from "../../models/RefData.js";

const attachIsCreator = (software, userId) => {
  if (!software) return software;
  const s = software.toObject ? software.toObject() : { ...software };
  s.isCreator = userId && s.uploadedBy?._id?.toString() === userId;
  return s;
};

export const getMyUploads = async (req, res) => {
  try {
    const softwares = await Software.find({ uploadedBy: req.user.id })
      .populate("uploadedBy", "displayName photoUrl");
    const result = softwares.map((s) => attachIsCreator(s, req.user.id));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Helper to cleanup failed upload
const cleanup = async (file) => {
  if (!file?.filename) return;
  try {
    const result = await cloudinary.uploader.destroy(file.filename, {
      resource_type: "raw",
      type: "authenticated",
    });
    console.log("Cleanup result:", result);
  } catch (destroyErr) {
    console.error("Cleanup failed:", destroyErr);
  }
};


export const uploadSoftware = async (req, res) => {
  try {
    const {
      title,
      description,
      version,
      price,
      allowedSessions,
      softwareOriginId,
      fileSize,      // 👈 from frontend
      fileName,      // 👈 from frontend
    } = req.body;

    if (!title || !description || !softwareOriginId || !fileSize || !fileName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      return res.status(400).json({ message: "Invalid version format. Expected x.y.z" });
    }

    if (!/^[a-zA-Z0-9._-]{3,64}$/.test(softwareOriginId)) {
      return res.status(400).json({
        message: "softwareOriginId must be 3–64 chars (letters, numbers, . _ -)",
      });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 1 || numPrice > 10000) {
      return res.status(400).json({ message: "Price must be between 1 and 10000" });
    }

    let numSessions = 1;
    if (allowedSessions !== undefined) {
      numSessions = Number(allowedSessions);
      if (isNaN(numSessions) || numSessions < 1 || numSessions > 10) {
        return res.status(400).json({ message: "allowedSessions must be between 1 and 10" });
      }
    }

    const existing = await Software.findOne({
      uploadedBy: req.user.id,
      softwareOriginId,
    });

    if (existing) {
      return res.status(409).json({
        message: "softwareOriginId already exists for your account",
      });
    }

    // create DB entry first (pending upload)
    const software = await Software.create({
      title,
      description,
      version,
      softwareOriginId,
      price: numPrice,
      publicId:`software/${softwareOriginId}.zip`,
      size: fileSize,
      uploadedBy: req.user.id,
      allowedSessions: numSessions,
    });

    const publicId = `${softwareOriginId}`;

    // 🔐 signed upload params
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      folder: "software",
      type: "authenticated",     
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(201).json({
      message: "Upload authorized",
      upload: {
        timestamp,
        public_id: publicId,
        folder: "software",
        resource_type: "raw",
        type: "authenticated",
        signature
      },
      software: attachIsCreator(software, req.user.id),
    });

  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern?.softwareOriginId) {
      return res.status(409).json({
        message: "softwareOriginId already exists globally. Choose a unique product identity."
      });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateBasics = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, version, price, allowedSessions } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0 || numPrice > 10000) {
        return res.status(400).json({ message: "Invalid price. Must be 0–10000" });
      }
      updateData.price = numPrice;
    }

    if (version !== undefined) {
      if (!/^\d+\.\d+\.\d+$/.test(version)) {
        return res.status(400).json({ message: "Invalid version format. Expected x.y.z" });
      }
      updateData.version = version;
    }

    if (allowedSessions !== undefined) {
      const numSessions = Number(allowedSessions);
      if (isNaN(numSessions) || numSessions < 1 || numSessions > 10) {
        return res.status(400).json({ message: "allowedSessions must be between 1 and 10" });
      }
      updateData.allowedSessions = numSessions;
    }

    const software = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      { $set: updateData },
      { new: true }
    ).populate("uploadedBy", "displayName photoUrl");

    if (!software) {
      return res.status(404).json({ message: "Software not found or not authorized" });
    }

    res.json({
      message: "Software basics updated successfully",
      software: attachIsCreator(software, req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ message: "Key is required" });
    }

    const updateOperation =
      value === null
        ? { $unset: { [`details.${key}`]: "" } }
        : { $set: { [`details.${key}`]: String(value) } };

    const software = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      updateOperation,
      { new: true }
    ).populate("uploadedBy", "displayName photoUrl");

    if (!software) {
      return res.status(404).json({ message: "Software not found or not authorized" });
    }

    res.json({
      message: "Software details updated successfully",
      software: attachIsCreator(software, req.user.id),
    });
  } catch (err) {
    console.error("Update details error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateDemoVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { demoVideo } = req.body;

    let updateOperation;
    if (demoVideo === null) {
      updateOperation = { $unset: { demoVideo: "" } };
    } else {
      const sanitizedUrl = extractYouTubeEmbed(String(demoVideo).trim());
      if (!sanitizedUrl) {
        return res.status(400).json({ message: "Invalid YouTube video URL or iframe" });
      }
      updateOperation = { $set: { demoVideo: sanitizedUrl } };
    }

    const software = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      updateOperation,
      { new: true }
    ).populate("uploadedBy", "displayName photoUrl");

    if (!software) {
      return res.status(404).json({ message: "Software not found or not authorized" });
    }

    res.json({
      message: demoVideo === null ? "Demo video deleted" : "Demo video updated",
      software: attachIsCreator(software, req.user.id),
    });
  } catch (err) {
    console.error("Update demo video error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch software and check if any RefData exists simultaneously
    const [software, hasRefData] = await Promise.all([
      Software.findById(id),
      RefData.exists({ software: id }),
    ]);

    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    if (software.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this software" });
    }

    if (hasRefData) {
      return res.status(400).json({ message: "Cannot delete software with existing references" });
    }

    if (software.publicId) {
      try {
        await cloudinary.uploader.destroy(software.publicId, {
          resource_type: "raw",
          type: "authenticated",
          invalidate: true,
        });
      } catch (cloudErr) {
        console.error("Cloudinary cleanup failed:", cloudErr);
      }
    }

    await software.deleteOne();
    res.status(200).json({ message: "Software deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const updateZip = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileSize, fileName } = req.body;

    if (!fileSize || !fileName) {
      return res.status(400).json({ message: "fileSize and fileName are required" });
    }

    const software = await Software.findOne({
      _id: id,
      uploadedBy: req.user.id
    });

    if (!software) {
      return res.status(404).json({ message: "Software not found or not authorized" });
    }

    // reuse same publicId → Cloudinary auto-replaces old file
    const publicId = software.softwareOriginId; // ensure no .zip

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      folder: "software",
      type: "authenticated",
      overwrite: true, // optional for form only
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      message: "Update upload authorized",
      upload: {
        timestamp,
        public_id: publicId,
        folder: "software",
        resource_type: "raw",
        type: "authenticated",
        overwrite: true, // optional for form only
        signature
      }
    });

  } catch (err) {
    console.error("Update zip failed:", err);
    res.status(500).json({ message: err.message });
  }
};
