import { useState } from "react";
import axios from "../api/axios";
import { Pencil, Save, X, Trash2 } from "lucide-react";

export default function SoftwareDemo({ software, setSoftware }) {
  const [editingVideo, setEditingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState(software.demoVideo || "");

  const handleSaveVideo = async () => {
    try {
      const { data } = await axios.put(
        `/software/seller/${software._id}/demo-video`,
        { demoVideo: newVideoUrl || null },
        { withCredentials: true }
      );
      setSoftware(data.software);
      setEditingVideo(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      const { data } = await axios.put(
        `/software/seller/${software._id}/demo-video`,
        { demoVideo: null },
        { withCredentials: true }
      );
      setSoftware(data.software);
      setEditingVideo(false);
      setNewVideoUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Thumbnail */}
      {software.thumbnail && (
        <img
          src={software.thumbnail}
          alt={software.title}
          className="w-full max-h-[420px] object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        />
      )}

      {/* Demo Video */}
      {software.demoVideo && !editingVideo ? (
        <div className="relative">
          {software.demoVideo.includes("youtube.com") ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <iframe
                src={software.demoVideo}
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : (
            <video
              src={software.demoVideo}
              controls
              className="w-full max-h-[420px] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            />
          )}

          {software.isCreator && (
            <button
              onClick={() => setEditingVideo(true)}
              className="absolute top-2 right-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              title="Edit Video"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      ) : software.isCreator ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Paste YouTube link or video URL"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />

          {/* Save */}
          <button
            onClick={handleSaveVideo}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="Save"
          >
            <Save size={18} />
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              setEditingVideo(false);
              setNewVideoUrl(software.demoVideo || "");
            }}
            className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            title="Cancel"
          >
            <X size={18} />
          </button>

          {/* Delete */}
          {software.demoVideo && (
            <button
              onClick={handleDeleteVideo}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              title="Delete Video"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No demo video available.
        </p>
      )}
    </div>
  );
}
