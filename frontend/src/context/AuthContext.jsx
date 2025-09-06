import { createContext, useState, useEffect } from "react";
import axios from "../api/axios.js";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      // Include credentials to use HttpOnly refresh token
    //   const response = await axios.get("/auth/me", { withCredentials: true });
    //   setUser(response.data.user);
    } catch (error) {
      console.log(error);
      if (user) {
        toast.error(error?.response?.data?.message || "Something went wrong while logging you in");
      }
      setUser(null);
    }
  };

  useEffect(() => {
    // Fetch user on mount
    fetchUser();

    // Refresh user info every 25 minutes
    const interval = setInterval(fetchUser, 25 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
