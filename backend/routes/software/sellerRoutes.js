// routes/software/sellerRoutes.js
import express from "express";
import upload from "../../middleware/uploadZipMiddleware.js";
import { uploadSoftware, getMyUploads } from "../../controllers/software/sellerController.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

// POST /api/software/seller/upload
router.post("/upload", isAuthenticated, upload.single("file"), uploadSoftware);

// GET /api/software/seller/my
router.get("/my-uploads", isAuthenticated, getMyUploads);

export default router;
