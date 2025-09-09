// controllers/software/sellerController.js
import Software from "../../models/Software.js";
import { extractYouTubeEmbed } from "../../utils/youtube.js";
import cloudinary from "../../config/cloudinary.js"

const attachIsCreator = (software, userId) => {
  if (!software) return software;
  const s = software.toObject ? software.toObject() : { ...software }; // handle Mongoose doc or plain obj
  s.isCreator = userId && s.uploadedBy.toString() === userId;
  return s;
};

export const getMyUploads = async (req, res) => {
  try {
    const softwares = await Software.find({ uploadedBy: req.user.id });
    const result = softwares.map((s) => attachIsCreator(s, req.user.id));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// Helper to extract Cloudinary public_id from uploaded URL


export const uploadSoftware = async (req, res) => {
  const cleanup = async () => {
      try {
        const publicId = req.file.filename;
        const result = await cloudinary.uploader.destroy(publicId, { 
          resource_type: "raw",
          type: "authenticated", 
        });
        console.log("Cleanup result:", result);
      } catch (destroyErr) {
        console.error("Cleanup failed:", destroyErr);
      }
    };
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid type" });
    }

    const { title, description, version, price } = req.body;

    if (!title || !description) {
      await cleanup();
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      await cleanup();
      return res.status(400).json({ message: "Invalid version format. Expected x.y.z" });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 10000) {
      await cleanup();
      return res.status(400).json({ message: "Price must be between 0 and 10000" });
    }

    // Create DB record only if valid
    const software = await Software.create({
      title,
      description,
      version,
      price: numPrice,
      publicId: req.file.filename, // keep filename as reference
      size: req.file.size,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: "Software uploaded successfully",
      software: attachIsCreator(software, req.user.id),
    });
  } catch (err) {
    console.error(err);

    // Extra cleanup if upload succeeded but DB write failed
    if (req.file?.filename) {
      cleanup()
    }

    res.status(500).json({ message: err.message });
  }
};


// Update basic info of a software (only creator)
export const updateBasics = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, version, price } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (price !== undefined) {
      if (isNaN(price) || Number(price) > 10000||Number(price) <1) {
        return res
          .status(400)
          .json({ message: "Invalid price. Must be a number ≤ 10000" });
      }
      updateData.price = price;
    }

    if (version !== undefined) {
      if (!/^\d+\.\d+\.\d+$/.test(version)) {
        return res
          .status(400)
          .json({ message: "Invalid version format. Expected x.y.z" });
      }
      updateData.version = version;
    }

    const software = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!software) {
      return res
        .status(404)
        .json({ message: "Software not found or not authorized" });
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

// Update or delete software details (only creator)
export const updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ message: "Key is required" });
    }

    let updateOperation;

    if (value === null) {
      // Delete the key
      updateOperation = { $unset: { [`details.${key}`]: "" } };
    } else {
      // Always store as string
      updateOperation = { $set: { [`details.${key}`]: String(value) } };
    }

    const software = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id },
      updateOperation,
      { new: true }
    );

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

// Update or delete demo video (only creator)
// Update or delete demo video (only creator)
export const updateDemoVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { demoVideo } = req.body;

    let updateOperation;

    if (demoVideo === null) {
      updateOperation = { $unset: { demoVideo: "" } }; // delete
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
    );

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

    // find software
    const software = await Software.findById(id);
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    // only the uploader can delete
    if (software.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this software" });
    }
    // console.log(software);
    // delete from cloudinary first
    if (software.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(software.publicId, {
          resource_type: "raw",
          type: "authenticated", // since you’re using authenticated delivery
          invalidate: true,
        });
        // console.log("Cloudinary delete result:", result);
      } catch (cloudErr) {
        // console.error("Cloudinary cleanup failed:", cloudErr);
      }
    }

    // delete from DB
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

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid type" });
    }

    // get old doc, then update
    const oldSoftware = await Software.findOneAndUpdate(
      { _id: id, uploadedBy: req.user.id }, // ownership enforced
      {
        $set: {
          publicId: req.file.filename, // or req.file.public_id if your multer-cloudinary gives that
          size: req.file.size,
          updatedAt: new Date(),
        },
      },
      { new: false } // return old doc BEFORE update
    );

    if (!oldSoftware) {
      return res.status(404).json({ message: "Software not found or not authorized" });
    }

    // delete old zip from cloudinary
    if (oldSoftware.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(oldSoftware.publicId, {
          resource_type: "raw",
          type: "authenticated",
          invalidate: true,
        });
        console.log("Old Cloudinary file deleted:", result);
      } catch (cloudErr) {
        console.error("Failed to delete old file from Cloudinary:", cloudErr);
      }
    }

    // prepare updated doc manually (instead of re-querying DB)
    const updatedSoftware = {
      ...oldSoftware.toObject(),
      publicId: req.file.filename,
      size: req.file.size,
      updatedAt: new Date(),
    };

    res.status(200).json({
      message: "Software zip updated successfully",
      software: updatedSoftware,
    });
  } catch (err) {
    console.error("Update zip failed:", err);
    res.status(500).json({ message: err.message });
  }
};