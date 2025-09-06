import React, { useEffect, useState } from "react";
import axios from "../api/axios.js"; // your axios instance
import { toast } from "react-toastify";

const BACKEND_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function Callback({ strategy }) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing login...");
  const [error, setError] = useState(null);

  const BACKEND_CALLBACK_URL = `${BACKEND_BASE_URL}/auth/${strategy}/callback`;

  useEffect(() => {
    const handleOAuthCallback = async () => {
      setLoading(true);
      setMessage(`Exchanging authorization code for ${strategy} login...`);
      setError(null);

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (!code) {
        const errMsg = "Authorization code not found in URL.";
        setError(errMsg);
        setMessage("Login failed.");
        toast.error(errMsg);
        if (window.opener) {
          window.opener.postMessage({ type: "AUTH_FAILURE", strategy, error: errMsg }, window.location.origin);
        }
        window.close();
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_CALLBACK_URL}?code=${code}&state=${state}`, {
          withCredentials: true,
        });

        setMessage("Login successful! Closing window...");
        setLoading(false);
        toast.success(`Logged in with ${strategy}!`);

        if (window.opener) {
          window.opener.postMessage(response.data, window.location.origin);
        }

        // window.close();
      } catch (err) {
        console.error("Error during token exchange:", err);
        const errorMessage = err?.response?.data?.message || "Unknown error during login.";
        setError(`Login failed: ${errorMessage}`);
        setMessage("An error occurred. Closing window...");
        setLoading(false);
        toast.error(`Login failed: ${errorMessage}`);
        // window.close();
      }
    };

    handleOAuthCallback();
  }, [strategy, BACKEND_CALLBACK_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {loading ? "Authenticating..." : "Login Status"}
        </h1>

        {loading && (
          <div className="mx-auto mb-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}

        <p className="text-slate-600 dark:text-slate-300 mb-4">{message}</p>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <p className="text-green-700 dark:text-green-300 font-semibold">
            You're all set! Closing window...
          </p>
        )}
      </div>
    </div>
  );
}
