import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = () => {
    localStorage.removeItem("login_token");
    setUser(null);
  };
  const fetchUserData = async () => {
    const token = localStorage.getItem("login_token");
    if (!token) {
      console.log("No token found, redirecting to login");
      logout();
      setLoading(false);
      return;
    }
    console.log(token);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_API_BASE_URL}/api/employees/current`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // Add this line
      } else {
        logout();
        console.log("Failed to fetch user data, redirecting to login");
      }
    } catch (error) {
      logout();
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
