// routes/ticketRoutes.js
import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/all",isAuthenticated, ticketController.getAll);
router.get("/:id",isAuthenticated, ticketController.getTicket);
// Create new ticket (buyer starts purchase)
router.post("/",isAuthenticated, ticketController.createTicket);

// Cancel ticket (buyer)
router.patch("/:id/cancel",isAuthenticated, ticketController.cancelTicket);

// Reject ticket (seller)
router.patch("/:id/reject",isAuthenticated, ticketController.rejectTicket);

// Resolve ticket (buyer confirms delivery)
// router.patch("/:id/resolve",isAuthenticated, ticketController.resolveTicket);
// routes/ticketRoutes.js
router.patch("/:id/last-read",isAuthenticated, ticketController.updateLastRead);


// Chat routes
router.post("/:id/chat/text",isAuthenticated, ticketController.pushTextMessage);
// router.post("/:id/chat/image",isAuthenticated, ticketController.pushImageMessage);
router.get("/:id/stream", isAuthenticated, ticketController.streamTicketUpdates);

export default router;
