// routes/software/buyerRoutes.js
import express from "express";
import { getAllSoftware } from "../../controllers/software/buyerController.js";

const router = express.Router();

// GET /api/software/buyer/all
router.get("/all", getAllSoftware);

export default router;
