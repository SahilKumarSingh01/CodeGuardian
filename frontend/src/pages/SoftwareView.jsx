import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // add navigate
import axios from "../api/axios";
import SoftwareHeader from "../components/SoftwareHeader.jsx";
import SoftwareDetails from "../components/SoftwareDetails.jsx";
import SoftwareDemo from "../components/SoftwareDemo.jsx";
import UploaderOverlay from "../components/UploaderOverlay.jsx";
import { toast } from "react-toastify";

export default function SoftwareView() {
  const { id } = useParams();
  const navigate = useNavigate(); // for redirecting after purchase
  const [software, setSoftware] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUploader, setOpenUploader] = useState(false);
  const [adding, setAdding] = useState(false);
  const [purchasing, setPurchasing] = useState(false); // track purchase state

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
    toast.success("ZIP updated successfully!");
  };

  const handleAddToWishlist = async () => {
    if (!software) return;
    setAdding(true);
    try {
      await axios.post(`/software/buyer/wishlist/${software._id}`);
      toast.success("Added to wishlist! ");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to wishlist.");
    } finally {
      setAdding(false);
    }
  };

  const handlePurchase = async () => {
    if (!software) return;
    setPurchasing(true);
    try {
      const { data } = await axios.post("/ticket", {
        softwareId: software._id,
      });
      toast.success("Purchase started! Ticket created.");
      // maybe redirect to ticket/chat view
      navigate(`/ticket/${data.ticket._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start purchase.");
    } finally {
      setPurchasing(false);
    }
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
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md disabled:opacity-50"
        >
          {purchasing ? "Purchasing..." : "Purchase"}
        </button>

        <button
          onClick={handleAddToWishlist}
          disabled={adding}
          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-md disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to Wishlist"}
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
