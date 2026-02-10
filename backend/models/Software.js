// models/Software.js
import mongoose from "mongoose";

const softwareSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },

    // 🔐 Permanent product identity (license binding)
    softwareOriginId: {
      type: String,
      required: true,
      unique:true,
      immutable: true,          // cannot be changed after creation
      index: true
    },

    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    demoVideo: { type: String }, // youtube url

    price: { type: Number, required: true },

    publicId: { type: String, required: true }, // Cloudinary public_id
    size: { type: Number, required: true },     // File size in bytes

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    allowedSessions: { type: Number, default: 1 }, // max devices per ref.dat
  },
  { timestamps: true }
);


export default mongoose.model("Software", softwareSchema);
