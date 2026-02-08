// components/ChatImage.jsx
import React, { useState } from "react";

export default function ChatImage({ url, size = 200 }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        style={{ width: size, height: size }}
        className="rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <img
          src={url}
          alt="chat-img"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Fullscreen Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={url}
            alt="full-chat-img"
            className="max-w-full max-h-full rounded-lg"
            draggable={false}
          />
        </div>
      )}
    </>
  );
}
