// middlewares/tokenHandler.js
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import {setAccessToken,clearRefreshToken,} from "../utils/authTokens.js";

export const tokenHandler = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  req.user = null;

  // 1️ Try access token first (no DB hit)
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = { id: payload.id };
      return next();
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        return next();
      }
      // expired → try refresh
    }
  }

  // 2️ No refresh token → guest
  if (!refreshToken) {
    return next();
  }

  try {
    const stored = await RefreshToken.findOne({ token: refreshToken });

    if (!stored) {
      await clearRefreshToken(res, refreshToken);
      return next();
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (String(stored.userId) !== String(decoded.id)) {
      await clearRefreshToken(res, refreshToken);
      return next();
    }

    //  Rotate access token only
    const accessOk = setAccessToken(res, decoded.id);
    if (!accessOk) return next();

    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    await clearRefreshToken(res, refreshToken);
    return next();
  }
};
