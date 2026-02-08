import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { Edit, Download, Trash2 } from "lucide-react";

export default function SoftwareControl() {
  const { id } = useParams();
  const [refData, setRefData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Download state
  const [downloadingSoftware, setDownloadingSoftware] = useState(false);
  const [softwareProgress, setSoftwareProgress] = useState(0);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const { data } = await axios.get(`/software/buyer/my-purchase/${id}`);
        setRefData(data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch software");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [id]);

  // Software download with progress
  const downloadSoftware = async () => {
    if (!refData?.software) return;

    try {
      setDownloadingSoftware(true);
      setSoftwareProgress(0);

      const { data } = await axios.get(`/software/buyer/my-software/${id}`);

      // Axios GET blob with progress
      const response = await axios.get(data.url, {
        responseType: "blob",
        withCredentials: false, // <-- important for signed URLs
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setSoftwareProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      const blobUrl = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = data.filename || "software.zip";
      a.click();
      URL.revokeObjectURL(blobUrl);

      toast.success("Software downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to download software");
    } finally {
      setDownloadingSoftware(false);
      setSoftwareProgress(0);
    }
  };

  // Reference.dat download
  const downloadRefFile = () => {
    if (!refData?.refKey) return toast.error("Reference file not available");

    const blob = new Blob([refData.refKey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reference.dat";
    a.click();

    URL.revokeObjectURL(url);
  }; 

  if (loading) return <p className="text-center mt-10">Loading software...</p>;
  if (!refData || !refData.software) return <p className="text-center mt-10">Software not found</p>;

  const { software, devices = [] } = refData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Software Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-2">{software.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{software.description}</p>
        <p className="text-sm text-gray-500">Version: {software.version}</p>
        <p className="text-green-600 dark:text-green-400 font-semibold mt-1">₹{software.price}</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl">
        <h2 className="font-semibold mb-2">How to use</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
          <li>Download the software ZIP and extract it.</li>
          <li>Download <code>reference.dat</code>.</li>
          <li>Place it in the same folder as the executable.</li>
          <li>Run the software.</li>
        </ul>
      </div>

      {/* Downloads */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full sm:w-auto">
          <button
            onClick={downloadSoftware}
            disabled={downloadingSoftware}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white w-full ${
              downloadingSoftware ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Download className="w-4 h-4" /> 
            {downloadingSoftware ? `Downloading... (${softwareProgress}%)` : "Download Software"}
          </button>
        </div>

        <button
          onClick={downloadRefFile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Download className="w-4 h-4" /> Download reference.dat
        </button>
      </div>


     {/* Sessions (devices) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="text-lg font-semibold mb-2">Your Sessions</h2>

        {devices.length === 0 && <p className="text-gray-500">No sessions yet.</p>}

        {devices.map((d) => (
          <div
            key={d} // use MongoDB auto-generated _id for key
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Session</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{d}</p>
            </div>

            <button
              onClick={async () => {
                try {
                  // Use deviceId for deletion
                  await axios.delete(`/software/buyer/my-purchase/${id}/device?device=${encodeURIComponent(d)}`);
                  setRefData(prev => ({
                    ...prev,
                    devices: prev.devices.filter(device => device !== d)
                  }));
                  toast.success("Session removed!");
                } catch (err) {
                  toast.error("Failed to delete session");
                }
              }}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        ))}
      </div>


    </div>
  );
}
