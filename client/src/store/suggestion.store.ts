import { create } from "zustand";
import api from "../utils/axios";

interface SuggestionState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  sendSuggestion: (type: string, suggestion: string) => Promise<void>;
  clearError: () => void;
  resetSuccess: () => void;
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
  isLoading: false,
  error: null,
  success: false,

  sendSuggestion: async (type: string, suggestion: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.post("/api/v1/suggestions", {
        type,
        suggestion,
      });

      set({ isLoading: false, success: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send suggestion";
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  resetSuccess: () => set({ success: false }),
}));
