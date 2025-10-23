import mongoose from "mongoose";

const notificationItemSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  type: { 
    type: String, 
    enum: ["ticket_created", "new_reply", "ticket_resolved", "ticket_closed"], 
    required: true 
  },
  data: { type: String }, // optional info
});

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notifications: [notificationItemSchema],
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
