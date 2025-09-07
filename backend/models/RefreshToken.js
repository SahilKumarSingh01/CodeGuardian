import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  userAgent: { type: String, required: true }, // browser/device identifier
  // revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // auto-expire after 7 days
});

export default mongoose.model("RefreshToken", refreshTokenSchema);
