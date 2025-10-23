// routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// 🛎 Get all notifications for logged-in user
router.get("/notifications", isAuthenticated, userController.getMyNotifications);

// 🗑 Remove a notification by its _id
router.delete("/notifications/:notifId", isAuthenticated, userController.removeNotification);

export default router;
