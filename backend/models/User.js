import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoUrl: { type: String }, // new field for profile photo
}, { timestamps: true });

export default mongoose.model("User", userSchema);
