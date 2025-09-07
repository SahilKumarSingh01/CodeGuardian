import jwt from "jsonwebtoken";
import passport from "passport";
import RefreshToken from "../models/RefreshToken.js"; // DB model
import User from "../models/User.js";
const ACCESS_TOKEN_EXPIRES = "15m"; // short-lived
const REFRESH_TOKEN_EXPIRES = "7d"; // long-lived

// Google Authentication Callback Handler
export const loginCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ success: false, message: "Authentication failed" });
    }

    try {
      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      // Save refresh token + user-agent in DB
      const userAgent = req.headers["user-agent"] || "unknown";
      await RefreshToken.create({
        userId: user.id,
        token: refreshToken,
        userAgent,
      });

      // Set refresh token as HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:  15 * 60 * 1000, // 15m
      });
      // Send response
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (dbErr) {
      return next(dbErr);
    }
  })(req, res, next);
};


export const getMe = async (req, res) => {
  try {
    // req.user is set by isAuthenticated middleware (id from token)
    const user = await User.findById(req.user.id); // don’t expose password/hash

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// Logout
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    // Delete from DB so it can’t be reused
    await RefreshToken.deleteOne({ token });
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};
