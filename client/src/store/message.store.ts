import { create } from "zustand";
import api from "../utils/axios";
import { useAuthStore } from "./auth.store";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadPreviousMessages: () => Promise<void>;
  clearHistory: () => void;
  reset: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  sessionId: localStorage.getItem("sessionId"),

  reset: () => {
    localStorage.removeItem("sessionId");
    set({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: null,
    });
  },

  sendMessage: async (content: string) => {
    try {
      set({ isLoading: true, error: null });

      // Add user message to the store immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
      };
      set((state) => ({ messages: [...state.messages, userMessage] }));

      // Get the current session ID or create a new one
      let { sessionId } = get();
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("sessionId", sessionId);
        set({ sessionId });
      }

      const { isAuthenticated, user } = useAuthStore.getState();

      const payload: any = {
        question: content,
        sessionId,
      };

      if (isAuthenticated && user) payload.userId = user._id;

      const response = await api.post("/api/v1/chat", payload);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.data.results,
        isUser: false,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to send message",
        isLoading: false,
      });
    }
  },

  loadPreviousMessages: async () => {
    try {
      set({ isLoading: true, error: null });

      const { isAuthenticated, user } = useAuthStore.getState();
      const { sessionId } = get();

      // Set up authorization if authenticated
      if (isAuthenticated && user) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
      }

      // Build query URL with sessionId if available
      let url = `/api/v1/chat`;
      if (sessionId) {
        url += `?sessionId=${sessionId}`;
      }

      const response = await api.get(url);

      if (response.data.success && response.data.data.messages) {
        // Find the most recent conversation with messages
        const conversations = response.data.data.messages;
        const latestConversation = conversations
          .filter((conv: any) => conv.messages && conv.messages.length > 0)
          .sort((a: any, b: any) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )[0];

        if (latestConversation && latestConversation.messages) {
          // Convert the messages to the format expected by the UI
          const formattedMessages = latestConversation.messages.map(
            (msg: any, index: number) => ({
              id: `history-${index}`,
              content: msg.content,
              isUser: msg.role === "user",
              timestamp: new Date(msg.timestamp || Date.now()),
            })
          );

          set({ messages: formattedMessages, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load messages",
        isLoading: false,
      });
    }
  },

  clearHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const res = await api.delete("/api/v1/chat");
      if (!res.data.success) set({ error: "Error deleting chat history" });
      set({ messages: [] });
    } catch (error) {
      console.error("Error loading messages:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete chat history",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
