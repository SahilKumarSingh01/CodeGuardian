import express from "express";
import passport from "../config/passport.js"; // import configured passport
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { loginCallback,getMe, logout } from "../controllers/authController.js";

const router = express.Router();

// Generic login route (method abstracted)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Login callback
router.get("/google/callback",loginCallback);
router.get("/me",isAuthenticated,getMe);
// Logout
router.post("/logout", logout);

export default router;
