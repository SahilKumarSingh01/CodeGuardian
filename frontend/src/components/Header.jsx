import { useTheme } from "../context/ThemeContext.jsx";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Explore", to: "/explore" },
    { name: "Docs", to: "/docs" },
    { name: "About", to: "/about" },
  ];

  // Reusable nav items for both desktop and mobile
  // Inside NavItems component
  const NavItems = ({ isMobile = false, onClickLink }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-center" // <-- added text-center
          onClick={onClickLink}
        >
          {link.name}
        </Link>
      ))}

      <button
        onClick={toggleTheme}
        className="px-3 py-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition w-full text-center" // <-- added text-center
      >
        {theme === "light" ? "Dark" : "Light"}
      </button>

      {user ? (
        !isMobile ? (
          <UserMenu />
        ) : (
          ""
        )
      ) : (
        <button
          onClick={() => {
            login();
            onClickLink?.();
          }}
          className="w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition text-center" // <-- added text-center
        >
          Login
        </button>
      )}
    </>
  );


  return (
      <header
        className={`${
          isMobile ? "px-[5%]" : "px-[10%]"
        } py-5 flex items-center justify-between`}
      >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-blue-600/10 grid place-items-center font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
          CG
        </div>
        <span className="text-xl font-semibold dark:text-white">CodeGuardian</span>
      </Link>

      {/* Mobile Header (hamburger + user) */}
      <div className="sm:hidden flex items-center gap-3">
        {user && <UserMenu />}
        <div
          className="flex flex-col gap-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block h-0.5 w-6 bg-gray-800 dark:bg-white transition-transform ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-800 dark:bg-white transition-opacity ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-800 dark:bg-white transition-transform ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden sm:flex items-center gap-4">
        <NavItems />
      </nav>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-800 shadow-md sm:hidden flex flex-col items-start p-4 gap-3 z-20">
          <NavItems isMobile={true} onClickLink={() => setIsOpen(false)} />
        </div>
      )}
    </header>
  );
}
