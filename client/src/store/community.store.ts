import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/axios";

interface Message {
  _id: string;
  content: string;
  username: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  username: string;
  isAnonymous: boolean;
  tags: string[];
  answers: Answer[];
  votes: number;
  createdAt: string;
  isNew: boolean;
  hasVoted?: boolean;
}

interface Answer {
  _id: string;
  content: string;
  username: string;
  isAnonymous: boolean;
  votes: number;
  createdAt: string;
  hasVoted?: boolean;
}

interface CommunityState {
  messages: Message[];
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isFetching: boolean;
  error: string | null;
  displayName: string | null;
  likedPosts: Set<string>;
  hasInitiallyLoaded: boolean;

  // Question actions
  createQuestion: (data: {
    title: string;
    content: string;
    tags: string[];
    isAnonymous: boolean;
  }) => Promise<void>;
  getQuestions: (page?: number) => Promise<void>;
  getQuestion: (id: string) => Promise<void>;
  addAnswer: (
    questionId: string,
    content: string,
    isAnonymous: boolean
  ) => Promise<void>;
  voteQuestion: (questionId: string) => Promise<void>;
  voteAnswer: (questionId: string, answerId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      messages: [],
      questions: [],
      currentQuestion: null,
      isLoading: false,
      isSubmitting: false,
      isFetching: false,
      error: null,
      displayName: null,
      likedPosts: new Set<string>(),
      hasInitiallyLoaded: false,

      reset: () => {
        set({
          messages: [],
          questions: [],
          currentQuestion: null,
          isLoading: false,
          isSubmitting: false,
          isFetching: false,
          error: null,
          hasInitiallyLoaded: false,
        });
      },

      createQuestion: async (data) => {
        try {
          set({ isSubmitting: true, error: null });

          const response = await api.post("/api/v1/community/questions", {
            ...data,
            username:
              localStorage.getItem("pamoja_anonymous_username") || "Anonymous",
          });
          const { question } = response.data.data;
          set((state) => ({
            questions: [{ ...question, isNew: true }, ...state.questions],
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to create question",
            isSubmitting: false,
          });
          throw error;
        }
      },

      getQuestions: async (page = 1) => {
        const state = get();
        if (
          state.hasInitiallyLoaded &&
          page === 1 &&
          state.questions.length > 0
        ) {
          return;
        }

        try {
          set({ isFetching: true, error: null });
          const response = await api.get(
            `/api/v1/community/questions?page=${page}`
          );
          const { likedPosts } = get();
          const questions = response.data.data.questions.map((q: Question) => ({
            ...q,
            hasVoted: likedPosts.has(q._id),
          }));

          set((state) => ({
            questions:
              page === 1 ? questions : [...state.questions, ...questions],
            isFetching: false,
            hasInitiallyLoaded: true,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch questions",
            isFetching: false,
          });
          throw error;
        }
      },

      getQuestion: async (id: string) => {
        try {
          set({ isFetching: true, error: null });
          const response = await api.get(`/api/v1/community/questions/${id}`);
          set({
            currentQuestion: response.data.data.question,
            isFetching: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch question",
            isFetching: false,
          });
          throw error;
        }
      },

      addAnswer: async (
        questionId: string,
        content: string,
        isAnonymous: boolean
      ) => {
        try {
          set({ isSubmitting: true, error: null });

          const response = await api.post(
            `/api/v1/community/questions/${questionId}/answers`,
            {
              content,
              username:
                localStorage.getItem("pamoja_anonymous_username") ||
                "Anonymous",
            }
          );

          const updatedQuestion = response.data.data.question;
          set((state) => ({
            currentQuestion: updatedQuestion,
            questions: state.questions.map((q) =>
              q._id === questionId ? updatedQuestion : q
            ),
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to add answer",
            isSubmitting: false,
          });
          throw error;
        }
      },

      voteQuestion: async (questionId: string) => {
        try {
          const { likedPosts } = get();
          if (likedPosts.has(questionId)) return;

          // Optimistic update
          set((state) => ({
            questions: state.questions.map((q) =>
              q._id === questionId
                ? { ...q, votes: q.votes + 1, hasVoted: true }
                : q
            ),
            currentQuestion:
              state.currentQuestion?._id === questionId
                ? {
                    ...state.currentQuestion,
                    votes: state.currentQuestion.votes + 1,
                    hasVoted: true,
                  }
                : state.currentQuestion,
          }));

          likedPosts.add(questionId);
          set({ likedPosts: new Set(likedPosts) });

          // Make API call
          const response = await api.post(
            `/api/v1/community/questions/${questionId}/vote`
          );

          // Update with actual server response if needed
          const updatedQuestion = response.data.data.question;
          set((state) => ({
            questions: state.questions.map((q) =>
              q._id === questionId ? { ...updatedQuestion, hasVoted: true } : q
            ),
            currentQuestion:
              state.currentQuestion?._id === questionId
                ? { ...updatedQuestion, hasVoted: true }
                : state.currentQuestion,
          }));
        } catch (error: any) {
          // likedPosts.delete(questionId);
          set((state) => ({
            questions: state.questions.map((q) =>
              q._id === questionId
                ? { ...q, votes: q.votes - 1, hasVoted: false }
                : q
            ),
            currentQuestion:
              state.currentQuestion?._id === questionId
                ? {
                    ...state.currentQuestion,
                    votes: state.currentQuestion.votes - 1,
                    hasVoted: false,
                  }
                : state.currentQuestion,
            // likedPosts: new Set(likedPosts),
            error:
              error.response?.data?.message || "Failed to vote on question",
          }));
        }
      },

      voteAnswer: async (questionId: string, answerId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post(
            `/api/v1/community/questions/${questionId}/answers/${answerId}/vote`
          );
          const updatedQuestion = response.data.data.question;

          set((state) => ({
            questions: state.questions.map((q) =>
              q._id === questionId ? updatedQuestion : q
            ),
            currentQuestion:
              state.currentQuestion?._id === questionId
                ? updatedQuestion
                : state.currentQuestion,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to vote on answer",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "community-storage",
      partialize: (state) => ({
        questions: state.questions,
        displayName: state.displayName,
        likedPosts: Array.from(state.likedPosts),
        hasInitiallyLoaded: state.hasInitiallyLoaded,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.likedPosts)) {
          state.likedPosts = new Set(state.likedPosts);
        }
      },
    }
  )
);
