import { createContext, useState, useEffect } from "react";
import axios from "../api/axios.js";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ fetch current user (middleware will refresh token if needed)
  const fetchUser = async () => {
    try {
      const response = await axios.get("/auth/me", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error("Fetch user failed:", error);
      setUser(null);
    }
  };

  // ✅ logout user (clears cookies in backend)
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  // ✅ Google login (popup)
  const login = () => {
    const authUrl = `${SERVER_URL}/auth/google`;
    const width = 600,
      height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = (event) => {
      if (event.data.success) {
        setUser(event.data.user);
        toast.success("Logged in successfully");
      }
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  // ✅ on mount, fetch user once
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null); // clear user
          toast.error("You need to login to access this feature");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
