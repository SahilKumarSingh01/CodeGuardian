// models/RefData.js
import mongoose from "mongoose";

const refDataSchema = new mongoose.Schema(
  {
    software: { type: mongoose.Schema.Types.ObjectId, ref: "Software", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    refKey: { type: String, required: true, unique: true },
    devices: [String],
  },
  { timestamps: false }
);

export default mongoose.model("RefData", refDataSchema);
