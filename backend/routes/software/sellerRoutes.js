// routes/software/sellerRoutes.js
import express from "express";
import upload from "../../middlewares/uploadZipMiddleware.js";
import * as sellerController from "../../controllers/software/sellerController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

// POST /api/software/seller/upload
router.post("/upload", isAuthenticated, upload.single("file"), sellerController.uploadSoftware);
router.put("/:id/zip", isAuthenticated, upload.single("file"), sellerController.updateZip);

// GET /api/software/seller/my
router.get("/my-uploads", isAuthenticated, sellerController.getMyUploads);
router.put("/:id/basics",isAuthenticated,sellerController.updateBasics)
router.put("/:id/details",isAuthenticated,sellerController.updateDetails)
router.put("/:id/demo-video",isAuthenticated,sellerController.updateDemoVideo)
router.delete("/:id",isAuthenticated,sellerController.deleteSoftware);

export default router;
