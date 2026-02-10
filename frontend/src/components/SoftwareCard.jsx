import { useState, useRef, useEffect } from "react";
import { MoreVertical, FileText, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SoftwareCard({ software, actions = [] , onClickFunc }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyId = async (e) => {
    e.stopPropagation(); // prevent card navigation
    await navigator.clipboard.writeText(software._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
                overflow-hidden hover:shadow-lg transition cursor-pointer relative"
      onClick={()=>{onClickFunc?onClickFunc():navigate(`/view/${software._id}`)}}
    >
      {/* Placeholder Icon */}
      <div className="h-36 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <FileText className="w-12 h-12 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate whitespace-nowrap overflow-hidden">
          {software.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm truncate whitespace-nowrap overflow-hidden">
          {software.description}
        </p>

        {software.uploadedBy && typeof software.uploadedBy === "object" && (
          <div className="flex items-center gap-2 mt-2 overflow-hidden">
            <img
              src={software.uploadedBy.photoUrl}
              alt={software.uploadedBy.displayName}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate whitespace-nowrap overflow-hidden">
              {software.uploadedBy.displayName}
            </span>
          </div>
        )}

        {/* Version */}
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate whitespace-nowrap overflow-hidden">
          Version: {software.version}
        </p>

        {/* Price */}
        <p className="text-green-600 dark:text-green-400 font-semibold mt-2 truncate whitespace-nowrap overflow-hidden">
          ₹{software.price}
        </p>

        {/* Software ID + Copy */}
        <div 
          className="mt-2 flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-700 
                    rounded-lg px-2 py-1 overflow-hidden"
          onClick={(e)=>e.stopPropagation()}
        >
          <span className="text-gray-600 dark:text-gray-300 truncate whitespace-nowrap overflow-hidden max-w-[180px]">
            ID: {software._id}
          </span>

          <button
            onClick={copyId}
            className="ml-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0"
            title="Copy ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Menu (3 dots) */}
      {actions.length>0&&(
        <div
          className="absolute top-3 right-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20"
            >
              {actions.map(({ name, func }) => (
                <button
                  key={name}
                  onClick={() => {
                    func(software);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm 
                            text-gray-700 dark:text-gray-200 
                            hover:bg-gray-100 dark:hover:bg-gray-700
                            focus:outline-none truncate whitespace-nowrap overflow-hidden"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

}
