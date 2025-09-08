// models/Software.js
import mongoose from "mongoose";

const softwareSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    price: { type: Number, required: true },
    publicId: { type: String, required: true }, // Cloudinary public_id
    size: { type: Number, required: true },     // File size in bytes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Software", softwareSchema);
