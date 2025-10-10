import React, { useState } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  UserGrowthChart,
  CommunityEngagementChart,
  ConversationAnalyticsChart,
  LearningMaterialsChart,
  TopTagsChart,
  MetricCard,
  DataTable,
} from "./DataVisualization";

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const {
    dashboardAnalytics,
    userGrowthData,
    communityEngagementData,
    conversationAnalyticsData,
    learningMaterialsData,
    loading,
    error,
  } = useAnalytics({ period: selectedPeriod, autoFetch: true });

  const periodOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "1y", label: "Last Year" },
  ];

  // Transform data for charts
  const transformUserGrowthData = () => {
    if (!userGrowthData?.userGrowth) return [];

    return userGrowthData.userGrowth.map((item) => ({
      date: `${item._id.month}/${item._id.day}`,
      total: item.count,
      registered: item.registered,
      anonymous: item.anonymous,
    }));
  };

  const transformCommunityEngagementData = () => {
    if (!communityEngagementData?.messageEngagement) return [];

    return communityEngagementData.messageEngagement.map((item) => ({
      date: `${item._id.month}/${item._id.day}`,
      messages: item.count,
      questions:
        communityEngagementData.questionEngagement.find(
          (q) => q._id.month === item._id.month && q._id.day === item._id.day
        )?.count || 0,
      answers:
        communityEngagementData.questionEngagement.find(
          (q) => q._id.month === item._id.month && q._id.day === item._id.day
        )?.totalAnswers || 0,
    }));
  };

  const transformConversationData = () => {
    if (!conversationAnalyticsData?.conversationTrends) return [];

    return conversationAnalyticsData.conversationTrends.map((item) => ({
      date: `${item._id.month}/${item._id.day}`,
      web: item.web,
      whatsapp: item.whatsapp,
    }));
  };

  const transformLearningMaterialsData = () => {
    if (!learningMaterialsData?.materialsByCategory) return [];

    return learningMaterialsData.materialsByCategory.map((item) => ({
      category: item._id || "Uncategorized",
      count: item.count,
      published: item.published,
      draft: item.draft,
    }));
  };

  const transformTopTagsData = () => {
    if (!communityEngagementData?.topTags) return [];

    return communityEngagementData.topTags.map((item) => ({
      tag: item._id,
      count: item.count,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-pamoja-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics & Visualizations
        </h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dashboard Metrics */}
      {dashboardAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="New Users (24h)"
            value={dashboardAnalytics.recentActivity.last24h.newUsers}
            change={
              dashboardAnalytics.recentActivity.last7d.newUsers > 0
                ? (dashboardAnalytics.recentActivity.last24h.newUsers /
                    dashboardAnalytics.recentActivity.last7d.newUsers) *
                  100
                : 0
            }
            changeType="increase"
          />
          <MetricCard
            title="New Messages (24h)"
            value={dashboardAnalytics.recentActivity.last24h.newMessages}
            change={
              dashboardAnalytics.recentActivity.last7d.newMessages > 0
                ? (dashboardAnalytics.recentActivity.last24h.newMessages /
                    dashboardAnalytics.recentActivity.last7d.newMessages) *
                  100
                : 0
            }
            changeType="increase"
          />
          <MetricCard
            title="New Questions (24h)"
            value={dashboardAnalytics.recentActivity.last24h.newQuestions}
            change={
              dashboardAnalytics.recentActivity.last7d.newQuestions > 0
                ? (dashboardAnalytics.recentActivity.last24h.newQuestions /
                    dashboardAnalytics.recentActivity.last7d.newQuestions) *
                  100
                : 0
            }
            changeType="increase"
          />
          <MetricCard
            title="New Conversations (24h)"
            value={dashboardAnalytics.recentActivity.last24h.newConversations}
            change={
              dashboardAnalytics.recentActivity.last7d.newConversations > 0
                ? (dashboardAnalytics.recentActivity.last24h.newConversations /
                    dashboardAnalytics.recentActivity.last7d.newConversations) *
                  100
                : 0
            }
            changeType="increase"
          />
        </div>
      )}

      {/* User Engagement Metrics */}
      {dashboardAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Users"
            value={dashboardAnalytics.userEngagement.totalUsers}
          />
          <MetricCard
            title="Active Users"
            value={dashboardAnalytics.userEngagement.activeUsers}
            change={
              dashboardAnalytics.userEngagement.totalUsers > 0
                ? (dashboardAnalytics.userEngagement.activeUsers /
                    dashboardAnalytics.userEngagement.totalUsers) *
                  100
                : 0
            }
            changeType="increase"
          />
          <MetricCard
            title="Avg Messages/User"
            value={dashboardAnalytics.userEngagement.avgMessagesPerUser.toFixed(
              1
            )}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserGrowthChart data={transformUserGrowthData()} />
        <CommunityEngagementChart data={transformCommunityEngagementData()} />
        <ConversationAnalyticsChart data={transformConversationData()} />
        <LearningMaterialsChart data={transformLearningMaterialsData()} />
      </div>

      {/* Top Tags Chart */}
      <TopTagsChart data={transformTopTagsData()} />

      {/* Conversation Analytics Table */}
      {conversationAnalyticsData && (
        <DataTable
          title="Conversation Analytics Summary"
          data={[
            {
              metric: "Average Messages per Conversation",
              value:
                conversationAnalyticsData.avgMessagesPerConversation.avgMessages.toFixed(
                  2
                ),
            },
            {
              metric: "Total Conversations",
              value:
                conversationAnalyticsData.avgMessagesPerConversation
                  .totalConversations,
            },
            {
              metric: "Total Messages",
              value:
                conversationAnalyticsData.avgMessagesPerConversation
                  .totalMessages,
            },
          ]}
          columns={[
            { key: "metric", label: "Metric" },
            { key: "value", label: "Value" },
          ]}
        />
      )}

      {/* Learning Materials Table */}
      {learningMaterialsData && (
        <DataTable
          title="Learning Materials by Category"
          data={transformLearningMaterialsData()}
          columns={[
            { key: "category", label: "Category" },
            { key: "count", label: "Total" },
            { key: "published", label: "Published" },
            { key: "draft", label: "Draft" },
            {
              key: "featured",
              label: "Featured",
              render: (value, row) => (
                <span
                  className={`px-2 py-1 text-sm ${
                    row.featured > 0
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {row.featured}
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default AnalyticsDashboard;
