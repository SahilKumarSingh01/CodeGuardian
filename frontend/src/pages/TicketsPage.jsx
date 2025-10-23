// src/pages/TicketsPage.jsx
import React from "react";
import TicketList from "../components/TicketList";
import TicketView from "../components/TicketView";

export default function TicketsPage() {
  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-1/3 border-r">
        <TicketList />
      </div>

      {/* Right panel */}
      <div className="flex-1">
        <TicketView />
      </div>
    </div>
  );
}
