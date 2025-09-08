// src/pages/NewSoftwareUpload.jsx
import React, { useState } from "react";
import { Upload, FileArchive, Tag, FileText } from "lucide-react";
import { toast } from "react-toastify";


export default function NewSoftwareUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    version: "",
    price: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file && file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        alert("Only .zip files are allowed!");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.file) {
    toast.error("Please select a .zip file to upload!");
    return;
  }

  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${import.meta.env.VITE_SERVER_URL}/software/seller/upload`, true);

  //  include cookies/session automatically
  xhr.withCredentials = true;

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      setProgress(percent);
    }
  };

  xhr.onload = () => {
    setUploading(false);
    if (xhr.status === 200 || xhr.status === 201) {
      toast.success("Software uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        version: "",
        price: "",
        file: null,
      });
      setProgress(0);
    } else {
      toast.error(`Upload failed. Status: ${xhr.status}`);
    }
  };

  xhr.onerror = () => {
    setUploading(false);
    toast.error("An error occurred during upload.");
  };

  setUploading(true);
  setProgress(0);
  xhr.send(data);
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg rounded-2xl p-8">
        <div className="flex items-center justify-center mb-8 gap-2">
          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Upload New Software
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 
                         text-gray-900 dark:text-white dark:bg-gray-800 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 
                         text-gray-900 dark:text-white dark:bg-gray-800 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Version */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4" /> Version
            </label>
            <input
              type="text"
              name="version"
              placeholder="e.g. 1.0.0"
              value={formData.version}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 
                         text-gray-900 dark:text-white dark:bg-gray-800 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price (INR)</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
                <span className="text-gray-500 mr-1">₹</span>
                <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full outline-none"
                />
            </div>
            </div>


          {/* File Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileArchive className="w-4 h-4" /> Upload .zip File
            </label>
            <input
              type="file"
              name="file"
              accept=".zip"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-500 
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700
                         dark:file:bg-blue-500 dark:file:hover:bg-blue-600
                         cursor-pointer"
            />
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 text-xs text-white text-center font-medium transition-all duration-200"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 
                       bg-blue-600 hover:bg-blue-700 
                       text-white font-semibold py-3 rounded-lg shadow-md 
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            {uploading ? "Uploading..." : "Upload Software"}
          </button>
        </form>
      </div>
    </div>
  );
}
