import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const savedUser = localStorage.getItem("user");

  try {
    // Parse only if it's valid JSON
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    setUser(parsedUser);
  } catch (error) {
    console.warn("Failed to parse user from localStorage:", error);
    // Remove invalid entry to prevent future errors
    localStorage.removeItem("user");
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);


  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
  <AuthContext.Provider value={{ user, login, logout, loading }}>
    {children}
  </AuthContext.Provider>
);

};
