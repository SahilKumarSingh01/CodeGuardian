// middlewares/tokenHandler.js
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

const ACCESS_EXPIRES = "15m"; // move to .env if you like

export const tokenHandler = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  // default guest
  req.user = null;

  // 1) If access token exists → try first (NO DB call)
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = { id: payload.id };
      // console.log(payload);
      return next();
    } catch (err) {
      // console.log(err);
      if (err.name !== "TokenExpiredError") {
        // invalid/tampered access token → ignore
        return next();
      }
      // expired → try refresh below
    }
  }

  // 2) Missing/expired access token → try refresh
  if (!refreshToken) {
    return next();
  }

  try {
    const stored = await RefreshToken.findOne({ token: refreshToken });

    if (!stored) {
      // ❌ Refresh token not in DB → clear from cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return next();
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // safety: ensure same user
    if (String(stored.userId) !== String(decoded.id)) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return next();
    }

    // ✅ Rotate access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    console.error("tokenHandler error (rotation):", err);

    // Clear invalid refresh token
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return next();
  }
};
