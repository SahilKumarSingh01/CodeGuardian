import jwt from "jsonwebtoken";
import passport from "passport";

const ACCESS_TOKEN_EXPIRES = "15m"; // short-lived
const REFRESH_TOKEN_EXPIRES = "7d"; // long-lived


// Google Authentication Callback Handler
export const loginCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ success: false, message: "Authentication failed" });

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user.id},
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES}
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    // console.log(req.logIn);
    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send JSON response
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.displayName,
        email: user.email,
        avatar: user.photo || null,
      },
      accessToken,
    });
  })(req, res, next);
};


// Refresh access token
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
