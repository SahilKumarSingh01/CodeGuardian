// utils/authTokens.js
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

const IS_PROD = process.env.NODE_ENV === "PROD";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "lax",
  partitioned: IS_PROD,
  path: "/",
};

const ACCESS_MAX = 15 * 60 * 1000;
const REFRESH_MAX = 7 * 24 * 60 * 60 * 1000;

// 1️ set access token
export const setAccessToken = (res, userId) => {
  try {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTS,
      maxAge: ACCESS_MAX,
    });

    return true;
  } catch {
    return false;
  }
};

// 2️ set refresh token
export const setRefreshToken = async (res, userId,userAgent) => {
  try {
    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );


    await RefreshToken.create({
      userId,
      token: refreshToken,
      userAgent
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTS,
      maxAge: REFRESH_MAX,
    });

    return true;
  } catch(e) {
    console.log(e)
    return false;
  }
};

// 3️ clear access token
export const clearAccessToken = (res) => {
  try {
    res.clearCookie("accessToken", COOKIE_OPTS);
    return true;
  } catch {
    return false;
  }
};

// 4️ clear refresh token
export const clearRefreshToken = async (res, refreshToken) => {
  try {
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.clearCookie("refreshToken", COOKIE_OPTS);
    return true;
  } catch {
    return false;
  }
};

