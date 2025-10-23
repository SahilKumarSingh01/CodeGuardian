import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, 
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ["text", "image"], required: true },
    data: { type: String, required: true }, // message text or image URL
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    software: { type: mongoose.Schema.Types.ObjectId, ref: "Software", required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    chats: [chatSchema],
    buyerLastRead: { type: Number, default: -1 },   // index of last chat buyer has read
    sellerLastRead: { type: Number, default: -1 },  // index of last chat seller has read
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
