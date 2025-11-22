import { create } from "zustand";
import api from "../utils/axios";

interface User {
  _id: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalMaterials: number;
  totalMessages: number;
  totalQuestions: number;
  totalConversations: number;
  totalSuggestions: number;
  totalTestimonials: number;
  anonymousUsers: number;
  registeredUsers: number;
  whatsappConversations: number;
}

interface UserGrowthData {
  userGrowth: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    anonymous: number;
    registered: number;
  }>;
  totalUsersOverTime: Array<{
    _id: { year: number; month: number; day: number };
    cumulative: number;
  }>;
  period: string;
}

interface CommunityEngagementData {
  messageEngagement: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    anonymous: number;
    registered: number;
  }>;
  questionEngagement: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    totalAnswers: number;
    totalVotes: number;
  }>;
  topTags: Array<{
    _id: string;
    count: number;
    totalVotes: number;
  }>;
  period: string;
}

interface ConversationAnalyticsData {
  conversationTrends: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    totalMessages: number;
    whatsapp: number;
    web: number;
    anonymous: number;
    registered: number;
  }>;
  avgMessagesPerConversation: {
    avgMessages: number;
    totalConversations: number;
    totalMessages: number;
  };
  period: string;
}

interface LearningMaterialsData {
  materialsByCategory: Array<{
    _id: string;
    count: number;
    published: number;
    draft: number;
    featured: number;
  }>;
  materialsOverTime: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    published: number;
    draft: number;
  }>;
  period: string;
}

interface DashboardAnalytics {
  recentActivity: {
    last24h: {
      newUsers: number;
      newMessages: number;
      newQuestions: number;
      newConversations: number;
      newMaterials: number;
    };
    last7d: {
      newUsers: number;
      newMessages: number;
      newQuestions: number;
      newConversations: number;
      newMaterials: number;
    };
    last30d: {
      newUsers: number;
      newMessages: number;
      newQuestions: number;
      newConversations: number;
      newMaterials: number;
    };
  };
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    avgMessagesPerUser: number;
    avgQuestionsPerUser: number;
    avgConversationsPerUser: number;
  };
}

interface Suggestion {
  _id: string;
  type: string;
  suggestion: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface AdminState {
  users: User[];
  usersPagination: PaginationInfo | null;
  stats: Stats | null;
  suggestions: Suggestion[];
  dashboardAnalytics: DashboardAnalytics | null;
  userGrowthData: UserGrowthData | null;
  communityEngagementData: CommunityEngagementData | null;
  conversationAnalyticsData: ConversationAnalyticsData | null;
  learningMaterialsData: LearningMaterialsData | null;
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  updateUserRole: (userId: string, role: "USER" | "ADMIN") => Promise<void>;
  fetchDashboardAnalytics: () => Promise<void>;
  fetchUserGrowthAnalytics: (period?: string) => Promise<void>;
  fetchCommunityEngagementAnalytics: (period?: string) => Promise<void>;
  fetchConversationAnalytics: (period?: string) => Promise<void>;
  fetchLearningMaterialsAnalytics: (period?: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  usersPagination: null,
  stats: null,
  suggestions: [],
  dashboardAnalytics: null,
  userGrowthData: null,
  communityEngagementData: null,
  conversationAnalyticsData: null,
  learningMaterialsData: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/api/v1/admin/stats");
      set({ stats: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch stats",
        loading: false,
      });
    }
  },

  fetchUsers: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/api/v1/admin/users?page=${page}&limit=${limit}`);
      set({ 
        users: response.data.data.users,
        usersPagination: response.data.data.pagination,
        loading: false 
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false,
      });
    }
  },

  fetchSuggestions: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/api/v1/admin/suggestions");
      set({ suggestions: response.data.data.suggestions, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch suggestions",
        loading: false,
      });
    }
  },

  updateUserRole: async (userId: string, role: "USER" | "ADMIN") => {
    try {
      set({ loading: true, error: null });
      await api.patch(`/api/v1/admin/users/${userId}/role`, { role });

      // Update user in state
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, role } : user
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update user role",
        loading: false,
      });
    }
  },

  fetchDashboardAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/api/v1/admin/dashboard");
      set({ dashboardAnalytics: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch dashboard analytics",
        loading: false,
      });
    }
  },

  fetchUserGrowthAnalytics: async (period = "30d") => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(
        `/api/v1/admin/analytics/user-growth?period=${period}`
      );
      set({ userGrowthData: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch user growth analytics",
        loading: false,
      });
    }
  },

  fetchCommunityEngagementAnalytics: async (period = "30d") => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(
        `/api/v1/admin/analytics/community-engagement?period=${period}`
      );
      set({ communityEngagementData: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch community engagement analytics",
        loading: false,
      });
    }
  },

  fetchConversationAnalytics: async (period = "30d") => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(
        `/api/v1/admin/analytics/conversations?period=${period}`
      );
      set({ conversationAnalyticsData: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch conversation analytics",
        loading: false,
      });
    }
  },

  fetchLearningMaterialsAnalytics: async (period = "30d") => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(
        `/api/v1/admin/analytics/learning-materials?period=${period}`
      );
      set({ learningMaterialsData: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch learning materials analytics",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
