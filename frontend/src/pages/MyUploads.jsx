import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import SoftwareCard from "../components/SoftwareCard.jsx";
import UploaderOverlay from "../components/UploaderOverlay.jsx";
import { useNavigate } from "react-router-dom";

export default function MyUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUploader, setOpenUploader] = useState(false);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const { data } = await axios.get("/software/seller/my-uploads");
        setUploads(data);
      } catch (error) {
        console.error("Failed to fetch uploads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  const handleView = (software) => {
    navigate(`/view/${software._id}`);
  };

  const handleDelete = async (software) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/software/seller/${software._id}`);
      setUploads((prev) => prev.filter((item) => item._id !== software._id));
    } catch (error) {
      console.error("Failed to delete software:", error);
    }
  };

  const handleUpdateZip = (software) => {
    setSelectedSoftwareId(software._id);
    setOpenUploader(true);
  };

  const handleUploaderSuccess = () => {
    // Optionally refetch uploads or update just that software in state
    setUploads((prev) =>
      prev.map((s) =>
        s._id === selectedSoftwareId
          ? { ...s, updatedAt: new Date() } // simple update to trigger re-render
          : s
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading your uploads...</p>
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No uploads found</p>
      </div>
    );
  }

  return (
    <>
       <UploaderOverlay
        open={openUploader}
        onClose={() => setOpenUploader(false)}
        softwareId={selectedSoftwareId}
        onSuccess={handleUploaderSuccess}
      />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Uploads</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {uploads.map((software) => (
          <SoftwareCard
            key={software._id}
            software={software}
            actions={[
              { name: "View", func: () => handleView(software) },
              { name: "Delete", func: () => handleDelete(software) },
              { name: "Update ZIP", func: () => handleUpdateZip(software) },
            ]}
          />
        ))}
      </div>

      {/* Overlay Uploader */}
      
    </div>
    </>
  );
}
