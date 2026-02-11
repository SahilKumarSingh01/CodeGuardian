// src/pages/NewSoftwareUpload.jsx
import React, { useState } from "react";
import { Upload, FileArchive, Tag, FileText, Fingerprint } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function NewSoftwareUpload() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    version: "",
    price: "",
    allowedSessions: 1,
    softwareOriginId: "",   // 🔐 NEW
    file: null,
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file && file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        toast.error("Only .zip files are allowed!");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { title, description, version, price, allowedSessions, file, softwareOriginId } = formData;

    if (!title || !description || !version || !price || !file || !softwareOriginId) {
      toast.error("All fields are required!");
      return false;
    }

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      toast.error("Version must follow x.y.z format (e.g. 1.0.0)");
      return false;
    }

    if (!/^[a-zA-Z0-9._-]{3,64}$/.test(softwareOriginId)) {
      toast.error("Software Origin ID must be 3–64 chars (letters, numbers, . _ -)");
      return false;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 1 || numPrice > 10000) {
      toast.error("Price must be between 1 and 10000");
      return false;
    }

    const numSessions = Number(allowedSessions);
    if (isNaN(numSessions) || numSessions < 1 || numSessions > 10) {
      toast.error("Allowed Sessions must be between 1 and 10");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setUploading(true);
      setProgress(0);

      const { file, ...meta } = formData;

      // 1️⃣ Ask backend for signed upload + DB entry
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/software/seller/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...meta,
            fileSize: file.size,
            fileName: file.name
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Upload authorization failed");
        setUploading(false);
        return;
      }

      // 2️⃣ Direct upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      Object.entries(data.upload).forEach(([key, value]) => {
        form.append(key, value);
      });


      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        true
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);

        if (xhr.status === 200) {
          toast.success("Software uploaded successfully!");
          navigate("/my-uploads");
        } else {
          toast.error("Cloud upload failed");
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        toast.error("Upload failed");
      };

      xhr.send(form);

    } catch (err) {
      console.error(err);
      console.log(err);
      setUploading(false);
      toast.error("Upload failed");
    }
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
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FileText className="w-4 h-4" /> Title
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {/* Software Origin ID */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Fingerprint className="w-4 h-4" /> Software Origin ID
            </label>
            <input
              type="text"
              name="softwareOriginId"
              placeholder="e.g. mytool-v1-enterprise"
              value={formData.softwareOriginId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Permanent product identity used for license binding (cannot be changed later)
            </p>
          </div>

          {/* Version */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Tag className="w-4 h-4" /> Version
            </label>
            <input type="text" name="version" placeholder="e.g. 1.0.0" value={formData.version} onChange={handleChange} required
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price (INR)</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <span className="text-gray-500 mr-1">₹</span>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full outline-none dark:bg-transparent" />
            </div>
          </div>

          {/* Allowed Sessions */}
          <div>
            <label className="block text-sm font-medium mb-1">Allowed Sessions</label>
            <input type="number" name="allowedSessions" min={1} max={10} value={formData.allowedSessions} onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {/* File Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FileArchive className="w-4 h-4" /> Upload .zip File
            </label>
            <input type="file" name="file" accept=".zip" onChange={handleChange} required
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-600 h-3 text-xs text-white text-center font-medium transition-all duration-200"
                style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}

          <button type="submit" disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50">
            <Upload className="w-5 h-5" />
            {uploading ? "Uploading..." : "Upload Software"}
          </button>

        </form>
      </div>
    </div>
  );
}
