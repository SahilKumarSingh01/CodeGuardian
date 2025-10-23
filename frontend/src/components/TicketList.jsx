// src/components/TicketList.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: activeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get("/ticket/all");
        setTickets(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="p-4">Loading tickets...</div>;

  return (
    <div className="h-full overflow-y-auto">
      {/* Back button */}
      <div className="p-4 border-b flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300"
        >
          &larr; Back
        </button>
        <h2 className="font-bold text-lg">Tickets</h2>
      </div>

      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <Link
              to={`/ticket/${ticket._id}`}
              className={`flex items-center justify-between gap-3 p-4 border-b transition 
                ${activeId === ticket._id ? "bg-gray-200" : ""}
                ${ticket.isSeller ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"}`}
            >
              {/* Counterparty info */}
              <div className="flex items-center gap-2">
                {ticket.isSeller ? (
                  <>
                    <img
                      src={ticket.buyer?.photoUrl}
                      alt={ticket.buyer?.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {ticket.buyer?.displayName}
                      </span>
                      <span className="text-xs text-gray-500">Buyer</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium">
                        {ticket.seller?.displayName}
                      </span>
                      <span className="text-xs text-gray-500">Seller</span>
                    </div>
                    <img
                      src={ticket.seller?.photoUrl}
                      alt={ticket.seller?.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  </>
                )}
              </div>

              {/* Software info */}
              <div className="flex-1 text-center">
                <div className="font-semibold">{ticket.software?.title || "Untitled"}</div>
                <div className="text-xs text-gray-500">₹{ticket.software?.price}</div>
              </div>

              {/* Status + Role Badge */}
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    ticket.isSeller
                      ? "bg-blue-200 text-blue-800"
                      : "bg-purple-200 text-purple-800"
                  }`}
                >
                  {ticket.isSeller ? "You are Seller" : "You are Buyer"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
