import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import SoftwareCard from "../components/SoftwareCard.jsx";
import { useNavigate } from "react-router-dom";

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await axios.get("/software/buyer/my-purchases"); // API returns all RefData for current user with software populated
        setPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleView = (ref) => {
    // If you want to view the software details page
    navigate(`/view/${ref.software._id}`);
  };

  const handleDelete = async (refId) => {
  try {
    await axios.delete(`/software/buyer/my-purchase/${refId}`);
    setPurchases(prev => prev.filter(p => p._id !== refId));
  } catch (err) {
    console.error("Failed to delete purchase:", err);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading your purchases...</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">You have no purchases yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {purchases.map((ref) => (
          <SoftwareCard
            key={ref._id}
            software={ref.software}
            extraInfo={{
              refKey: ref.key, // optional: show key or hide
              purchasedAt: new Date(ref.createdAt).toLocaleDateString()
            }}
            actions={[
              { name: "View", func: () => handleView(ref) },
              { name: "Delete", func: () => handleDelete(ref._id) },
            ]}
            onClickFunc={()=>{navigate(`/software-control/${ref._id}`)}}
          />
        ))}
      </div>
    </div>
  );
}
