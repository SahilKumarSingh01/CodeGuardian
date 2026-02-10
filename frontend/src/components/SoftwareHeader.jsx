import { ArrowLeft, Copy, Fingerprint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditBox from "./EditBox.jsx";
import axios from "../api/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SoftwareHeader({ software, setSoftware }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (field, value) => {
    try {
      setSaving(true);

      let payload = { [field]: value };
      if (field === "price" || field === "allowedSessions") {
        payload[field] = Number(value);
      }

      const { data } = await axios.put(
        `/software/seller/${software._id}/basics`,
        payload,
        { withCredentials: true }
      );

      setSoftware(data.software);
      toast.success("Updated successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update. Please try again.";
      toast.error(message);
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const copyOriginId = async () => {
    try {
      await navigator.clipboard.writeText(software.softwareOriginId);
      toast.success("Software Origin ID copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-3">
          {software.isCreator ? (
            <EditBox
              value={software.title}
              onSave={(val) => handleUpdate("title", val)}
            />
          ) : (
            software.title
          )}
        </h1>

        <p className="text-blue-100 text-lg leading-relaxed">
          {software.isCreator ? (
            <EditBox
              value={software.description}
              onSave={(val) => handleUpdate("description", val)}
            />
          ) : (
            software.description
          )}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-6">
          <span className="font-medium bg-white/20 px-4 py-2 rounded-lg">
            Version:{" "}
            {software.isCreator ? (
              <EditBox
                value={software.version}
                onSave={(val) => handleUpdate("version", val)}
              />
            ) : (
              software.version
            )}
          </span>

          <span className="font-medium flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            ₹
            {software.isCreator ? (
              <EditBox
                value={software.price}
                type="number"
                onSave={(val) => handleUpdate("price", val)}
              />
            ) : (
              software.price
            )}
          </span>

          <span className="font-medium bg-white/20 px-4 py-2 rounded-lg">
            Allowed Sessions:{" "}
            {software.isCreator ? (
              <EditBox
                value={software.allowedSessions}
                type="number"
                onSave={(val) => handleUpdate("allowedSessions", val)}
              />
            ) : (
              software.allowedSessions
            )}
          </span>
        </div>

        {/* 🔐 Software Origin ID (creator only) */}
        { software.softwareOriginId && (
          <div className="mt-6 flex items-center gap-3 bg-white/15 px-4 py-3 rounded-xl">
            <Fingerprint className="w-5 h-5 text-white/90" />
            <span className="text-sm font-mono tracking-wide">
              {software.softwareOriginId}
            </span>
            <button
              onClick={copyOriginId}
              className="ml-auto flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        )}

        {saving && <p className="text-sm mt-2 text-yellow-200">Saving...</p>}
      </div>
    </>
  );
}
