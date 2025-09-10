import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import SoftwareCard from "../components/SoftwareCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("/software/buyer/wishlist");
        setWishlist(data); // already returning softwares only
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleView = (software) => {
    navigate(`/view/${software._id}`);
  };

  const handleRemove = async (software) => {
    if (!confirm("Remove from wishlist?")) return;
    try {
      await axios.delete(`/software/buyer/wishlist/${software._id}`);
      setWishlist((prev) => prev.filter((item) => item._id !== software._id));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((software) => (
          <SoftwareCard
            key={software._id}
            software={software}
            actions={[
              { name: "View", func: () => handleView(software) },
              { name: "Remove", func: () => handleRemove(software) },
            ]}
          />
        ))}
      </div>
    </div>
  );
}
