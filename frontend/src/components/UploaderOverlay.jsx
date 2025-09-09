// src/components/UploaderOverlay.jsx
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function UploaderOverlay({ open, onClose, softwareId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!open) return null;

  const handleUpload = () => {
    if (!file) return toast.warn("Please select a file first!");
    setLoading(true);
    setProgress(0);

    const data = new FormData();
    data.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${import.meta.env.VITE_SERVER_URL}/software/seller/${softwareId}/zip`, true);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(0);

      try {
        const res = JSON.parse(xhr.responseText);

        if (xhr.status === 200 || xhr.status === 201) {
          toast.success(res.message || "ZIP updated successfully!");
          onSuccess?.();
          onClose();
        } else {
          toast.error(res.message || `Upload failed. Status: ${xhr.status}`);
        }
      } catch {
        toast.error(`Upload failed. Status: ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setProgress(0);
      toast.error("An error occurred during upload.");
    };

    xhr.send(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-sm relative flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Update Software ZIP
        </h2>

        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full mb-4"
        />

        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Update ZIP"}
        </button>
      </div>
    </div>
  );
}
