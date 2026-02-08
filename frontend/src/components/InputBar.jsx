// src/components/InputBar.jsx
import React, { useState, useRef } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { FiImage, FiSend } from "react-icons/fi";

export default function InputBar({ ticket }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleSendText = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await axios.post(`/ticket/${ticket._id}/chat/text`, { message });
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setSending(true);
    setProgress(0);

    // Use XHR for progress
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${import.meta.env.VITE_SERVER_URL}/ticket/${ticket._id}/chat/image`, true);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setSending(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success("Image sent");
      } else {
        console.error(xhr.responseText);
        toast.error("Failed to send image.");
      }
      e.target.value = null;
    };

    xhr.onerror = () => {
      setSending(false);
      setProgress(0);
      toast.error("Upload failed.");
      e.target.value = null;
    };

    xhr.send(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="border-t p-3 flex flex-col gap-2 bg-white">
      <div className="flex items-center gap-2">
        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg p-2 text-sm resize-none focus:outline-blue-400"
          rows={1}
          disabled={sending}
        />

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Image Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={sending}
          className="bg-gray-100 hover:bg-gray-200 border px-3 py-2 rounded-lg text-gray-700 flex items-center justify-center"
          title="Send image"
        >
          <FiImage size={18} />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSendText}
          disabled={sending}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
          title="Send message"
        >
          <FiSend size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      {sending && progress > 0 && (
         <div
            className="striped-progress"
            style={{ width: `${progress}%` }}
          />
      )}

    </div>
  );
}
