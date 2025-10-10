import { useState, useEffect, useRef } from "react";
import api from "../utils/axios";

interface UseAnalyticsOptions {
  period?: string;
  autoFetch?: boolean;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { period = "30d", autoFetch = true } = options;
  const [data, setData] = useState({
    dashboardAnalytics: null,
    userGrowthData: null,
    communityEngagementData: null,
    conversationAnalyticsData: null,
    learningMaterialsData: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchDashboardAnalytics = async () => {
    try {
      const response = await api.get("/api/v1/admin/dashboard");
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard analytics"
      );
    }
  };

  const fetchUserGrowthAnalytics = async (period: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/analytics/user-growth?period=${period}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user growth analytics"
      );
    }
  };

  const fetchCommunityEngagementAnalytics = async (period: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/analytics/community-engagement?period=${period}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch community engagement analytics"
      );
    }
  };

  const fetchConversationAnalytics = async (period: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/analytics/conversations?period=${period}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch conversation analytics"
      );
    }
  };

  const fetchLearningMaterialsAnalytics = async (period: string) => {
    try {
      const response = await api.get(
        `/api/v1/admin/analytics/learning-materials?period=${period}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch learning materials analytics"
      );
    }
  };

  const fetchAllData = async (currentPeriod: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const [
        dashboardAnalytics,
        userGrowthData,
        communityEngagementData,
        conversationAnalyticsData,
        learningMaterialsData,
      ] = await Promise.all([
        fetchDashboardAnalytics(),
        fetchUserGrowthAnalytics(currentPeriod),
        fetchCommunityEngagementAnalytics(currentPeriod),
        fetchConversationAnalytics(currentPeriod),
        fetchLearningMaterialsAnalytics(currentPeriod),
      ]);

      setData({
        dashboardAnalytics,
        userGrowthData,
        communityEngagementData,
        conversationAnalyticsData,
        learningMaterialsData,
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodData = async (currentPeriod: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const [
        userGrowthData,
        communityEngagementData,
        conversationAnalyticsData,
        learningMaterialsData,
      ] = await Promise.all([
        fetchUserGrowthAnalytics(currentPeriod),
        fetchCommunityEngagementAnalytics(currentPeriod),
        fetchConversationAnalytics(currentPeriod),
        fetchLearningMaterialsAnalytics(currentPeriod),
      ]);

      setData((prev) => ({
        ...prev,
        userGrowthData,
        communityEngagementData,
        conversationAnalyticsData,
        learningMaterialsData,
      }));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllData(period);
    }
  }, [autoFetch, period]);

  useEffect(() => {
    if (autoFetch && hasFetched.current) {
      fetchPeriodData(period);
    }
  }, [period]);

  return {
    ...data,
    loading,
    error,
    refetch: () => fetchAllData(period),
    refetchPeriod: () => fetchPeriodData(period),
  };
};
