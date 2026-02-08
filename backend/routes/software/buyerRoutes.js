// routes/software/buyerRoutes.js
import express from "express";
import * as buyerController from "../../controllers/software/buyerController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
const router = express.Router();

// GET /api/software/buyer/all
router.get("/my-purchases", isAuthenticated,buyerController.getBuyerPurchases);
router.get("/my-purchase/:id", isAuthenticated,buyerController.getMyPurchaseById);
router.delete("/my-purchase/:id", isAuthenticated,buyerController.removePurchase);

router.get("/my-software/:id", isAuthenticated,buyerController.downloadSoftware);
router.delete("/my-purchase/:id/device", isAuthenticated,buyerController.deleteDeviceById);



router.get("/wishlist",isAuthenticated,buyerController.getWishlist);
router.post("/wishlist/:id",isAuthenticated,buyerController.addToWishlist);
router.delete("/wishlist/:id",isAuthenticated,buyerController.removeFromWishlist);

export default router;
