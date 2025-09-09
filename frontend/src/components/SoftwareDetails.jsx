import { useState } from "react";
import axios from "../api/axios";
import EditBox from "../components/EditBox";
import { Trash2 } from "lucide-react"; // Lucide trash icon

export default function SoftwareDetails({ software, setSoftware }) {
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const details = software.details || {};
  
  const handleUpdateDetail = async (key, value) => {
    try {
      const payload = { key, value }; // send to backend
      const { data } = await axios.put(
        `/software/seller/${software._id}/details`,
        payload,
        { withCredentials: true }
      );
      setSoftware(data.software);
      setEditingKey(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDetail = async () => {
    if (!newKey || !newValue) return;
    try {
      const payload = { key: newKey, value: newValue };
      const { data } = await axios.put(
        `/software/seller/${software._id}/details`,
        payload,
        { withCredentials: true }
      );
      setSoftware(data.software);
      setNewKey("");
      setNewValue("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDetail = async (key) => {
    try {
      const payload = { key, value: null }; // send null to delete
      const { data } = await axios.put(
        `/software/seller/${software._id}/details`,
        payload,
        { withCredentials: true }
      );
      setSoftware(data.software);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Details</h2>

      {Object.keys(details).length === 0 && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          No additional details provided for this software.
        </p>
      )}

      <div className="space-y-3">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-semibold w-32">{key}:</span>
            {software.isCreator && editingKey === key ? (
              <EditBox
                value={value}
                onSave={(val) => handleUpdateDetail(key, val)}
                onCancel={() => setEditingKey(null)}
              />
            ) : (
              <span
                className={`flex-1 ${software.isCreator ? "cursor-pointer" : ""} text-gray-700 dark:text-gray-300 flex items-center justify-between`}
                onClick={() => software.isCreator && setEditingKey(key)}
              >
                {value}
                {software.isCreator && (
                  <Trash2
                    size={18}
                    className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering edit
                      handleDeleteDetail(key);
                    }}
                  />
                )}
              </span>
            )}
          </div>
        ))}

        {/* Add new detail */}
        {software.isCreator && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="e.g., OS, RAM, CPU"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 flex-1"
            />
            <input
              type="text"
              placeholder="e.g., Windows 11, 16GB, Intel i7"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 flex-1"
            />
            <button
              onClick={handleAddDetail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
