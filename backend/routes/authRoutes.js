import express from "express";
import passport from "../config/passport.js"; // import configured passport
import { loginCallback, refreshToken, logout } from "../controllers/authController.js";

const router = express.Router();

// Generic login route (method abstracted)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Login callback
router.get("/google/callback",loginCallback);

// Refresh access token
router.get("/refresh-token", refreshToken);

// Logout
router.get("/logout", logout);

export default router;
