import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import SoftwareHeader from "../components/SoftwareHeader.jsx";
import SoftwareDetails from "../components/SoftwareDetails.jsx";
import SoftwareDemo from "../components/SoftwareDemo.jsx";
import UploaderOverlay from "../components/UploaderOverlay.jsx";
import { toast } from "react-toastify";

export default function SoftwareView() {
  const { id } = useParams();
  const [software, setSoftware] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUploader, setOpenUploader] = useState(false);

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const { data } = await axios.get(`/software/${id}`);
        setSoftware(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch software.");
      } finally {
        setLoading(false);
      }
    };
    fetchSoftware();
  }, [id]);

  const handleUploaderSuccess = () => {
    // Optionally refresh software info or just show toast
    toast.success("ZIP updated successfully!");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Software not found.
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SoftwareHeader software={software} setSoftware={setSoftware} />
      <SoftwareDemo software={software} setSoftware={setSoftware} />
      <SoftwareDetails software={software} setSoftware={setSoftware} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
          Purchase
        </button>
        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-md">
          Add to Wishlist
        </button>

        {/* Only show if user is creator */}
        {software.isCreator && (
          <button
            onClick={() => setOpenUploader(true)}
            className="flex-1 bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition shadow-md"
          >
            Change ZIP
          </button>
        )}
      </div>

      {/* Uploader Overlay */}
      <UploaderOverlay
        open={openUploader}
        onClose={() => setOpenUploader(false)}
        softwareId={software._id}
        onSuccess={handleUploaderSuccess}
      />
    </div>
  );
}
