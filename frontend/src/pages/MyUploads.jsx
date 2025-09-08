import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import SoftwareCard from "../components/SoftwareCard.jsx";

export default function MyUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Define handlers outside the return
  const handleView = (software) => {
    console.log("View", software._id);
    // navigate(`/software/${software._id}`); // if needed later
  };

  const handleDelete = async (software) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/software/${software._id}`);
      setUploads((prev) => prev.filter((item) => item._id !== software._id));
    } catch (error) {
      console.error("Failed to delete software:", error);
    }
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Uploads</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads.map((software) => (
          <SoftwareCard
            key={software._id}
            software={software}
            actions={[
              { name: "View", onClick: () => handleView(software) },
              { name: "Delete", onClick: () => handleDelete(software) },
            ]}
          />
        ))}
      </div>
    </div>
  );
}
