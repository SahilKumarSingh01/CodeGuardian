const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  licenses: [
    {
      softwareId: String,
      issuedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
