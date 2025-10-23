import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden"
      >
        <img
          src={user?.photoUrl || "/default-avatar.png"} 
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-9999">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {user?.displayName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>

          <ul className="py-2">
            <li>
              <button
                onClick={() => navigate("/my-uploads")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                My Uploaded Software
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/my-purchases")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                My Purchases
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/wishlist")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                My Wishlist
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/upload-new")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                Upload New Software
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/references")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                Download Reference Key
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/ticket")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              >
                Tickets
              </button>
            </li>
            <li>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 font-medium"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
