import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import InputBar from "./InputBar.jsx";
import ChatImage from "./ChatImage.jsx";

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch ticket
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

    if (eventSourceRef.current) eventSourceRef.current.close();

    const source = new EventSource(
      `${import.meta.env.VITE_SERVER_URL}/ticket/${id}/stream`,
      { withCredentials: true }
    );
    eventSourceRef.current = source;

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setTicket((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, chats: [...prev.chats, data.chat] };
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

    return () => source.close();
  }, [id]);

  // ===== ACTION HANDLERS =====
  const handleApprove = async () => {
    try {
      const { data } = await axios.patch(`/ticket/${id}/approve`);
      toast.success(data.message || "Software approved and delivered.");
      setTicket((ticket)=>{return {...ticket,status:"closed"}});
    } catch (err) {
      console.error(err);
      toast.error("Approval failed.");
    }
  };

  const handleReject = async () => {
    try {
      const { data } = await axios.patch(`/ticket/${id}/reject`);
      toast.success(data.message || "Ticket rejected.");
      setTicket((ticket)=>{return {...ticket,status:"closed"}});
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed.");
    }
  };

  const handleCancel = async () => {
    try {
      const { data } = await axios.patch(`/ticket/${id}/cancel`);
      toast.success(data.message || "Ticket cancelled.");
      setTicket((ticket)=>{return {...ticket,status:"closed"}});
    } catch (err) {
      console.error(err);
      toast.error("Cancel failed.");
    }
  };

  // ===== RENDER =====
  if (!id) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a ticket to view details
      </div>
    );
  }

  if (loading) return <div className="p-4">Loading ticket...</div>;
  if (!ticket) return <div className="p-4 text-gray-500">Ticket not found</div>;

  const isSeller = ticket.isSeller; // backend flag
  const isOpen = ticket.status === "open"; // only open tickets allow actions

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

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              ticket.status === "open"
                ? "bg-green-100 text-green-700"
                : ticket.status === "approved"
                ? "bg-blue-100 text-blue-700"
                : ticket.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {ticket.status}
          </span>

          {/* Action buttons only if ticket is open */}
          {isOpen && isSeller && (
            <>
              <button
                onClick={handleApprove}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}
          {isOpen && !isSeller && (
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {ticket.chats?.map((msg, idx) => {
          const isBuyerMsg = msg.sender === ticket.buyer._id;
          const sender = isBuyerMsg ? ticket.buyer : ticket.seller;

          return msg.type === "system" ? (
            <div
              key={idx}
              className="w-full text-center text-gray-500 text-sm italic my-2"
            >
              {msg.data}
            </div>
          ) : (
            <div
              key={idx}
              className={`flex items-start gap-2 max-w-md ${
                isBuyerMsg ? "self-start flex-row" : "self-end flex-row-reverse"
              }`}
            >
              <img
                src={sender.photoUrl}
                alt={sender.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`p-3 rounded-lg ${
                  isBuyerMsg ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <div className="text-sm font-medium">{sender.displayName}</div>

                {msg.type === "text" && <div className="text-sm">{msg.data}</div>}
                {msg.type === "image" && <ChatImage url={msg.data} size={200} />}

                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );

        })}
      </div>

      {/* Input Bar only if ticket is open */}
      {isOpen && <InputBar ticket={ticket} />}
    </div>
  );
}
