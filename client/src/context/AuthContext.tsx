import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  sessionId: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  generateAnonymousSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const generateAnonymousSession = async () => {
    try {
      const response = await axios.post("/api/auth/anonymous");
      const { sessionId, displayName } = response.data.data;

      setUser({
        sessionId,
        displayName,
        isAnonymous: true,
      });

      // Store in localStorage
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("displayName", displayName);
    } catch (error) {
      console.error("Error generating anonymous session:", error);
    }
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    const displayName = localStorage.getItem("displayName");

    if (sessionId && displayName) {
      setUser({
        sessionId,
        displayName,
        isAnonymous: true,
      });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, generateAnonymousSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
