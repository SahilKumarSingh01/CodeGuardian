import { useTheme } from "../context/ThemeContext.jsx";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Unified login function (Google popup)
  const login = () => {
    const authUrl = SERVER_URL + "/auth/google";
    const width = 600, height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(authUrl, "_blank", `width=${width},height=${height},top=${top},left=${left}`);

    const handleMessage = (event) => {
      // Optional: restrict origin check
      // if (event.origin !== SERVER_URL) return;
      if (event.data.success) {
        setUser(event.data.user);
        console.log("here is recceived data",event.data);
        navigate("/about", { state: { user: event.data.user } });
      }
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-blue-600/10 grid place-items-center font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
          CG
        </div>
        <span className="text-xl font-semibold dark:text-white">CodeGuardian</span>
      </a>

      {/* Navigation */}
      <nav className="hidden sm:flex items-center gap-4">
        <a href="/explore" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
          Explore
        </a>
        <a href="/about" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
          About
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-500 text-sm dark:text-white"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>

        {/* Google Login */}
        <button
          onClick={login}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Login
        </button>
      </nav>
    </header>
  );
}
