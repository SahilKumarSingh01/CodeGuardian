import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import InputBar from "./InputBar.jsx";

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch ticket details
  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/ticket/${id}`);
        setTicket(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // SSE: live updates
  useEffect(() => {
    if (!id) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const source = new EventSource(
      `${import.meta.env.VITE_SERVER_URL}/ticket/${id}/stream`,
      { withCredentials: true }
    );
    eventSourceRef.current = source;

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("hello there");
      if (data.type === "chat") {
        setTicket((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, chats: [...prev.chats, data.chat] };

          // Scroll to bottom
          setTimeout(() => {
            chatContainerRef.current?.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 50);

          return updated;
        });
      } else if (data.type === "status") {
        setTicket((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    };

    source.onerror = (err) => {
      console.error("SSE error:", err);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [id]);

  if (!id) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a ticket to view details
      </div>
    );
  }

  if (loading) return <div className="p-4">Loading ticket...</div>;

  if (!ticket)
    return <div className="p-4 text-gray-500">Ticket not found</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{ticket.software?.title}</h2>
          <p className="text-sm text-gray-600">
            Price: ₹{ticket.software?.price}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            ticket.status === "open"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {ticket.chats?.map((msg, idx) => {
          const isBuyer = msg.sender === ticket.buyer._id;
          const sender = isBuyer ? ticket.buyer : ticket.seller;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2 max-w-md ${
                isBuyer ? "self-start flex-row" : "self-end flex-row-reverse"
              }`}
            >
              <img
                src={sender.photoUrl}
                alt={sender.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`p-3 rounded-lg ${
                  isBuyer ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <div className="text-sm font-medium">{sender.displayName}</div>
                <div className="text-sm">{msg.data}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <InputBar ticket={ticket} />
    </div>
  );
}
