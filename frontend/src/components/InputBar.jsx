// src/components/InputBar.jsx
import React, { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function InputBar({ ticket }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const { data } = await axios.post(`/ticket/${ticket._id}/chat/text`, {
        message
      });

      // Optionally: update ticket chats locally to show message instantly
      // if (ticket.chats) {
      //   ticket.chats.push(data.chat);
      // } else {
      //   ticket.chats = [data.chat];
      // }

      setMessage(""); // clear input
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3 flex items-center gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 border rounded-lg p-2 text-sm resize-none focus:outline-blue-400"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={sending}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
