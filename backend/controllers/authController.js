import passport from "passport";
import User from "../models/User.js";
import {setAccessToken,setRefreshToken,clearAccessToken,clearRefreshToken} from "../utils/authTokens.js";

// Google Authentication Callback Handler
export const loginCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Authentication failed" });
    }

    if (!user) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    const userAgent = req.headers["user-agent"] || "unknown";

    const accessOk = setAccessToken(res, user._id);
    const refreshOk = await setRefreshToken(res, user._id,userAgent);

    if (!accessOk || !refreshOk) {
      return res.status(500).json({ message: "Token issuance failed" });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
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
  const refreshToken = req.cookies?.refreshToken;

  const accessCleared = clearAccessToken(res);
  const refreshCleared = await clearRefreshToken(res, refreshToken);

  if (!accessCleared || !refreshCleared) {
    return res.status(500).json({ message: "Logout failed" });
  }

  return res.json({ message: "Logout successful" });
};

