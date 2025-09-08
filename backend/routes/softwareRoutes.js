// routes/softwareRoutes.js
import express from "express";
import buyerRoutes from "./software/buyerRoutes.js";
import sellerRoutes from "./software/sellerRoutes.js";
import {searchSoftware} from "../controllers/softwareController.js"
const router = express.Router();

router.use("/buyer", buyerRoutes);
router.use("/seller", sellerRoutes);
router.get("/search",searchSoftware);
export default router;
