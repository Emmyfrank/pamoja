import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (token) {
          const res = await axios.get("/api/v1/auth/me");
          setUser(res.data.data.user);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // If token is invalid, clear it
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [token]);

  // Generate anonymous session
  const generateAnonymousSession = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/auth/anonymous-session");
      const newSessionId = res.data.data.sessionId;
      setSessionId(newSessionId);
      localStorage.setItem("sessionId", newSessionId);
      return newSessionId;
    } catch (err) {
      console.error("Anonymous session error:", err);
      setError("Failed to generate anonymous session");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/v1/auth/register", userData);
      setUser(res.data.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/v1/auth/login", credentials);
      setUser(res.data.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Get session ID (create one if it doesn't exist)
  const getSessionId = async () => {
    if (sessionId) return sessionId;

    const newSessionId = await generateAnonymousSession();
    return newSessionId;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        sessionId,
        loading,
        error,
        register,
        login,
        logout,
        getSessionId,
        isAuthenticated: !!user,
        isAnonymous: !user && !!sessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
