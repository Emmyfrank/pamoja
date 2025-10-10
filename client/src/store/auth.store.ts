import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/axios";
import { useMessageStore } from "./message.store";
import { useCommunityStore } from "./community.store";
import { useRandomName } from "../hooks/useRandomName";

interface User {
  _id: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  role?: "USER" | "ADMIN";
  createdAt?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;

  isAnonymous: boolean;
  checkAuth: () => void;
  register: (userData: {
    username: string;
    password: string;
    isAnonymous?: boolean;
  }) => Promise<any>;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => void;
  getSessionId: () => Promise<string | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      sessionId: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isAnonymous: false,
      isCheckingAuth: true,

      checkAuth: async () => {
        set({ loading: true, error: null });
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
          const res = await api.get("/api/v1/auth/me");
          const { user } = res.data.data;
          set({ user, isAuthenticated: true });
        } catch (err: any) {
          useRandomName();
          return null;
        } finally {
          set({ isCheckingAuth: false, loading: false });
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const res = await api.post("/api/v1/auth/register", userData);
          const { user, token } = res.data.data;
          localStorage.setItem("token", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            isAnonymous: user.isAnonymous,
            loading: false,
          });

          return res.data;
        } catch (err: any) {
          const errorMessage =
            err.response?.data.message || "Registration failed";
          set({ error: errorMessage, loading: false });
          return null;
        }
      },

      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const res = await api.post("/api/v1/auth/login", credentials);
          const { user, token } = res.data.data;

          localStorage.setItem("token", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            isAnonymous: user.isAnonymous,
            loading: false,
          });

          return res.data;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message ||
            "Couldn't sign in you in, check you credentials";
          set({ error: errorMessage, loading: false });
          return null;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("displayName");
        localStorage.removeItem("sessionId");
        delete api.defaults.headers.common["Authorization"];

        // Reset other stores
        const { reset: resetMessages } = useMessageStore.getState();
        const { reset: resetCommunity } = useCommunityStore.getState();
        resetMessages();
        resetCommunity();

        set({
          user: null,
          token: null,
          sessionId: null,
          isAuthenticated: false,
          isAnonymous: false,
        });
      },

      getSessionId: async () => {
        const { sessionId } = get();
        if (sessionId) return sessionId;

        try {
          set({ loading: true, error: null });
          const res = await api.post("/api/v1/auth/anonymous-session");
          const newSessionId = res.data.data.sessionId;

          set({
            sessionId: newSessionId,
            isAnonymous: true,
            loading: false,
          });

          return newSessionId;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.error || "Failed to generate anonymous session";
          set({ error: errorMessage, loading: false });
          return null;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        sessionId: state.sessionId,
      }),
    }
  )
);
