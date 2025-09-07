import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

const ACCESS_TOKEN_EXPIRES = "15m";

export const isAuthenticated = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired, login again" });
    }

    try {
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // Check refresh token existence in DB
      const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        userId: refreshPayload.id,
      });

      if (!storedToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        { id: refreshPayload.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      // Set new cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      req.user = { id: refreshPayload.id };
      return next();
    } catch (refreshErr) {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }
  }
};
