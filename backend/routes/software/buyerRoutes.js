// routes/software/buyerRoutes.js
import express from "express";
import { getAllSoftware ,getWishlist,addToWishlist,removeFromWishlist} from "../../controllers/software/buyerController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
const router = express.Router();

// GET /api/software/buyer/all
router.get("/all", getAllSoftware);

router.get("/wishlist",isAuthenticated,getWishlist);
router.post("/wishlist/:id",isAuthenticated,addToWishlist);
router.delete("/wishlist/:id",isAuthenticated,removeFromWishlist);

export default router;
