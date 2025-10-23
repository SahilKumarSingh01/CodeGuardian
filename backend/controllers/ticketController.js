// controllers/ticketController.js
import Ticket from "../models/Ticket.js";
import Software from "../models/Software.js";
import { pushNotification } from "../utils/notifications.js";
import mongoose from "mongoose";
import ably from "../config/ably.js";
// Create new ticket (buyer starts purchase)
export const createTicket = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { softwareId } = req.body;

    if (!softwareId) {
      return res.status(400).json({ message: "softwareId is required" });
    }

    const software = await Software.findById(softwareId);
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    const sellerId = software.uploadedBy;

    // first chat message
    const firstChatMessage = `I want to buy "${software.title}" at ₹${software.price}`;

    // generate local ObjectId for ticket
    const ticketId = new mongoose.Types.ObjectId();

    // create ticket object for direct insert
    const ticketData = {
      _id: ticketId,
      buyer: buyerId,
      seller: sellerId,
      software: software._id,
      status: "open",
      chats: [
        {
          sender: buyerId,
          type: "text",
          data: firstChatMessage
        }
      ]
    };

    // run both operations in parallel
    const [ticket] = await Promise.all([
      Ticket.create(ticketData),  // directly inserts into DB
      pushNotification(sellerId, "ticket_created", firstChatMessage, ticketId)
    ]);

    res.status(201).json({ message: "Ticket created and seller notified!", ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Push a text message to a ticket
export const pushTextMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { message } = req.body;
    const ticketId = req.params.id;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // fetch ticket to find recipient and validate sender
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ensure sender is either buyer or seller
    if (ticket.buyer.toString() !== senderId && ticket.seller.toString() !== senderId) {
      return res.status(403).json({ message: "You are not allowed to send messages in this ticket" });
    }

    // determine recipient (other party)
    const recipientId = ticket.buyer.toString() === senderId ? ticket.seller : ticket.buyer;

    // chat object
    const chat = {
      sender: senderId,
      type: "text",
      data: message,
      timestamp: new Date()
    };

    // push chat and notification in parallel
    await Promise.all([
      Ticket.findByIdAndUpdate(
        ticketId,
        { $push: { chats: chat } },
        { new: true }  // return updated document
      ),
      pushNotification(recipientId, "new_reply", message, ticket._id)
    ]);
    
    const channel = ably.channels.get(`ticket-${ticketId}`);
    channel.publish("chat", {
      type: "chat",
      chat,
      ticketId,
      senderId,
      timestamp: chat.timestamp
    }).catch(err => console.error("Ably publish error:", err));
    // io.to(ticketId).emit("new_chat", chat);
    res.status(200).json({ message: "Message sent!", chat });
  } catch (error) {
    console.error("Error pushing text message:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Cancel ticket (buyer)
export const cancelTicket = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const ticketId = req.params.id;

    // update ticket only if buyer matches and ticket is open or in_progress
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, buyer: buyerId, status: { $in: ["open", "in_progress"] } },
      { status: "closed" },
      { new: true }
    );

    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found, not open, or you are not the buyer" });
    }

    // notify seller
    await pushNotification(ticket.seller, "ticket_closed", `Buyer cancelled the ticket for "${ticket.software}"`, ticket._id);

    res.status(200).json({ message: "Ticket cancelled successfully", ticket });
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject ticket (seller)
export const rejectTicket = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const ticketId = req.params.id;

    // update ticket only if seller matches and ticket is open
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, seller: sellerId, status: "open" },
      { status: "closed" },
      { new: true }
    );

    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found, not open, or you are not the seller" });
    }

    // notify buyer
    await pushNotification(ticket.buyer, "ticket_closed", `Seller rejected the ticket for "${ticket.software}"`, ticket._id);

    res.status(200).json({ message: "Ticket rejected successfully", ticket });
  } catch (error) {
    console.error("Error rejecting ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update last read index for buyer or seller
export const updateLastRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;
    const { lastReadIndex } = req.body;

    if (lastReadIndex === undefined || lastReadIndex < 0) {
      return res.status(400).json({ message: "Valid lastReadIndex is required" });
    }

    // update only the correct field depending on user
    const update = {};
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.buyer.toString() === userId) {
      update.buyerLastRead = lastReadIndex;
    } else if (ticket.seller.toString() === userId) {
      update.sellerLastRead = lastReadIndex;
    } else {
      return res.status(403).json({ message: "You are not part of this ticket" });
    }

    await Ticket.findByIdAndUpdate(ticketId, update);

    res.status(200).json({ message: "Last read index updated", update });
  } catch (error) {
    console.error("Error updating last read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tickets for current user (buyer or seller)
export const getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find(
      {
        $or: [{ buyer: userId }, { seller: userId }]
      },
      { chats: 0 } // exclude full chats
    )
      .populate("buyer", "displayName photoUrl")
      .populate("seller", "displayName photoUrl")
      .populate("software", "title price")
      .sort({ updatedAt: -1 })
      .lean(); // convert to plain objects so we can safely add fields

    // add isSeller field
    const ticketsWithRole = tickets.map((t) => ({
      ...t,
      isSeller: t.seller._id.toString() === userId
    }));

    res.status(200).json(ticketsWithRole);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;

    // Find the ticket and populate buyer, seller, software
    const ticket = await Ticket.findById(ticketId)
      .populate("buyer", "displayName photoUrl")
      .populate("seller", "displayName photoUrl")
      .populate("software", "title price");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the current user is involved
    if (ticket.buyer._id.toString() !== userId && ticket.seller._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this ticket" });
    }

    // Add role awareness
    const ticketWithRole = {
      ...ticket.toObject(),
      isSeller: ticket.seller._id.toString() === userId
    };

    res.status(200).json(ticketWithRole);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// SSE endpoint for live ticket updates (dynamic channel per ticket)
export const streamTicketUpdates = async (req, res) => {
  const { id } = req.params;
  const channel = ably.channels.get(`ticket-${id}`); // auto-created if doesn't exist

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Initial connection event
  res.write(`data: ${JSON.stringify({ connected: true, ticketId: id })}\n\n`);

  const listener = (msg) => {
    res.write(`data: ${JSON.stringify(msg.data)}\n\n`);
  };

  channel.subscribe(listener);

  req.on("close", () => {
    channel.unsubscribe(listener);
    res.end();
  });
};