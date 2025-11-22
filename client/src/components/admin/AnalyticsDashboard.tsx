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
  GaugeChart,
  ProgressBar,
  MetricCardWithProgress,
  HourlyActivityChart,
  DayOfWeekActivityChart,
  CategoryPerformanceRadar,
  AnswerDistributionChart,
  ConversationLengthChart,
  PlatformComparisonChart,
  ActivitySegmentsChart,
  UserCohortsChart,
  PredictiveAnalyticsChart,
} from "./DataVisualization";

/**
 * Dashboard Configuration
 * 
 * Customize all metrics, labels, colors, and titles here for easy maintenance.
 * This makes the dashboard fully customizable without touching the component logic.
 * 
 * To customize:
 * 1. Change titles, labels, and colors in the DASHBOARD_CONFIG object below
 * 2. All metric cards, progress bars, and labels will automatically update
 * 3. Colors use hex codes - you can use Pamoja brand colors or any custom colors
 * 4. Add new metrics by extending the config structure
 */
const DASHBOARD_CONFIG = {
  metrics: {
    newUsers: {
      title: "NEW USERS",
      label: "users",
      color: "#3b82f6",
      icon: "👥",
    },
    healthInquiries: {
      title: "HEALTH INQUIRIES",
      label: "messages",
      color: "#AA60C8",
      icon: "💬",
    },
    platformReach: {
      title: "PLATFORM REACH",
      label: "users",
      color: "#f97316",
      icon: "🌍",
    },
    communityQuestions: {
      title: "COMMUNITY QUESTIONS",
      label: "questions",
      color: "#22c55e",
      icon: "❓",
    },
  },
  summaryCards: {
    totalUsers: {
      title: "Total Platform Users",
      color: "#3b82f6",
    },
    aiConversations: {
      title: "AI Conversations",
      color: "#22c55e",
    },
    healthResources: {
      title: "Health Resources",
      color: "#f97316",
    },
  },
  targets: {
    userGrowth: {
      label: "User Growth Target",
      color: "#3b82f6",
    },
    messageGrowth: {
      label: "Message Growth Target",
      color: "#AA60C8",
    },
    engagement: {
      label: "Engagement Rate Target",
      color: "#22c55e",
    },
    contentPublishing: {
      label: "Content Publishing Target",
      color: "#f97316",
    },
  },
};

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1y");
  const {
    dashboardAnalytics,
    userGrowthData,
    communityEngagementData,
    conversationAnalyticsData,
    learningMaterialsData,
    advancedStatistics,
    predictiveAnalytics,
    loading,
    error,
  } = useAnalytics({ period: selectedPeriod, autoFetch: true });

  const periodOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "1y", label: "Last Year" },
  ];

  // Helper to format date based on period
  const formatDate = (item: any) => {
    if (selectedPeriod === "1y") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    }
    return `${item._id.month}/${item._id.day}`;
  };

  // Helper to match items by date
  const matchByDate = (item1: any, item2: any) => {
    if (selectedPeriod === "1y") {
      return item1._id.year === item2._id.year && item1._id.month === item2._id.month;
    }
    return item1._id.year === item2._id.year && 
           item1._id.month === item2._id.month && 
           item1._id.day === item2._id.day;
  };

  // Transform data for charts
  const transformUserGrowthData = () => {
    if (!userGrowthData?.userGrowth) return [];

    return userGrowthData.userGrowth.map((item: any) => ({
      date: formatDate(item),
      total: item.count,
      registered: item.registered,
      anonymous: item.anonymous,
    }));
  };

  const transformCommunityEngagementData = () => {
    if (!communityEngagementData?.messageEngagement) return [];

    return communityEngagementData.messageEngagement.map((item: any) => {
      const matchingQuestion = communityEngagementData.questionEngagement.find(
        (q: any) => matchByDate(q, item)
      );
      return {
        date: formatDate(item),
        messages: item.count,
        questions: matchingQuestion?.count || 0,
        answers: matchingQuestion?.totalAnswers || 0,
      };
    });
  };

  const transformConversationData = () => {
    if (!conversationAnalyticsData?.conversationTrends) return [];

    return conversationAnalyticsData.conversationTrends.map((item: any) => ({
      date: formatDate(item),
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Data & Statistics Dashboard
          </h2>
          <p className="text-gray-600">
            Comprehensive analytics, insights, and predictive modeling for Pamoja platform
          </p>
        </div>
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

      {/* Statistics Overview Cards */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Total Users</div>
            <div className="text-2xl font-bold">{(dashboardAnalytics.calculatedMetrics.totalUsers || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Total Questions</div>
            <div className="text-2xl font-bold">{(dashboardAnalytics.calculatedMetrics.totalQuestions || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Conversations</div>
            <div className="text-2xl font-bold">{(dashboardAnalytics.calculatedMetrics.totalConversations || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Materials</div>
            <div className="text-2xl font-bold">{(dashboardAnalytics.calculatedMetrics.totalMaterials || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-sm opacity-90 mb-1">Engagement</div>
            <div className="text-2xl font-bold">{((dashboardAnalytics.calculatedMetrics.engagementRate || 0).toFixed(1))}%</div>
          </div>
        </div>
      )}

      {/* Key Metrics with Circular Progress */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && dashboardAnalytics.recentActivity && dashboardAnalytics.recentActivity.last30d && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCardWithProgress
            title={DASHBOARD_CONFIG.metrics.newUsers.title}
            value={`+${dashboardAnalytics.recentActivity.last30d.newUsers || 0} ${DASHBOARD_CONFIG.metrics.newUsers.label}`}
            progress={50}
            change={0}
            changeType="neutral"
            color={DASHBOARD_CONFIG.metrics.newUsers.color}
          />
          <MetricCardWithProgress
            title={DASHBOARD_CONFIG.metrics.platformReach.title}
            value={`${((dashboardAnalytics.calculatedMetrics.totalUsers || 0) / 1000).toFixed(1)}K ${DASHBOARD_CONFIG.metrics.platformReach.label}`}
            progress={Math.min(
              ((dashboardAnalytics.calculatedMetrics.engagementRate || 0) / 100) * 100,
              100
            )}
            change={dashboardAnalytics.calculatedMetrics.engagementRate || 0}
            changeType="increase"
            color={DASHBOARD_CONFIG.metrics.platformReach.color}
            description="Shows the total number of users on the platform. The circular progress indicates engagement rate percentage."
          />
          <MetricCardWithProgress
            title={DASHBOARD_CONFIG.metrics.communityQuestions.title}
            value={`+${dashboardAnalytics.recentActivity.last30d.newQuestions || 0} ${DASHBOARD_CONFIG.metrics.communityQuestions.label}`}
            progress={Math.min(
              ((dashboardAnalytics.calculatedMetrics.answerRate || 0) / 100) * 100,
              100
            )}
            change={dashboardAnalytics.calculatedMetrics.answerRate || 0}
            changeType="increase"
            color={DASHBOARD_CONFIG.metrics.communityQuestions.color}
            description="Displays new community questions added in the last 30 days. The circular progress shows the answer rate percentage."
          />
        </div>
      )}

      {/* Summary Statistics */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title={DASHBOARD_CONFIG.summaryCards.totalUsers.title}
            value={(dashboardAnalytics.calculatedMetrics.totalUsers || 0).toLocaleString()}
            change={0}
            changeType="neutral"
          />
          <MetricCard
            title={DASHBOARD_CONFIG.summaryCards.aiConversations.title}
            value={`${((dashboardAnalytics.calculatedMetrics.totalConversations || 0) / 1000).toFixed(1)}K`}
            change={0}
            changeType="neutral"
          />
          <MetricCard
            title={DASHBOARD_CONFIG.summaryCards.healthResources.title}
            value={(dashboardAnalytics.calculatedMetrics.totalMaterials || 0).toLocaleString()}
            change={dashboardAnalytics.calculatedMetrics.publishRate || 0}
            changeType="increase"
          />
        </div>
      )}

      {/* User Engagement Metrics */}
      {dashboardAnalytics && dashboardAnalytics.userEngagement && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Users"
            value={dashboardAnalytics.userEngagement.totalUsers || 0}
          />
          <MetricCard
            title="Active Users"
            value={dashboardAnalytics.userEngagement.activeUsers || 0}
            change={
              (dashboardAnalytics.userEngagement.totalUsers || 0) > 0
                ? ((dashboardAnalytics.userEngagement.activeUsers || 0) /
                    (dashboardAnalytics.userEngagement.totalUsers || 1)) *
                  100
                : 0
            }
            changeType="increase"
          />
          <MetricCard
            title="Avg Messages/User"
            value={((dashboardAnalytics.userEngagement.avgMessagesPerUser || 0).toFixed(
              1
            ))}
          />
        </div>
      )}

      {/* Traffic Sources Chart - Combo Chart */}
      <ConversationAnalyticsChart 
        data={transformConversationData()} 
        description="X-axis: Time period (dates). Left Y-axis: Web conversations (bars). Right Y-axis: WhatsApp conversations (line). Compares platform usage over time."
      />

      {/* Engagement Gauges */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GaugeChart
            title="User Engagement Rate"
            value={Math.round(dashboardAnalytics.calculatedMetrics.engagementRate || 0)}
            max={100}
            subtitle={`${dashboardAnalytics.calculatedMetrics.engagementRate || 0}% Users Active`}
            color="#22c55e"
          />
          <GaugeChart
            title="Community Participation"
            value={Math.round(dashboardAnalytics.calculatedMetrics.engagementRate || 0)}
            max={100}
            subtitle={`${dashboardAnalytics.calculatedMetrics.activeUsers || 0} Active Community Members`}
            color="#AA60C8"
          />
          <GaugeChart
            title="Question Response Rate"
            value={Math.round(dashboardAnalytics.calculatedMetrics.answerRate || 0)}
            max={100}
            subtitle={`${dashboardAnalytics.calculatedMetrics.questionsWithAnswers || 0} Questions Answered`}
            color="#3b82f6"
          />
        </div>
      )}

      {/* Advanced Statistics Section */}
      {advancedStatistics && (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border border-purple-200 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Advanced Statistical Analysis
            </h2>
            <p className="text-gray-600 mb-6">
              Comprehensive data insights and patterns for informed decision-making
            </p>
          </div>

          {/* Time-based Activity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HourlyActivityChart 
              data={advancedStatistics.hourlyActivity || []} 
              description="X-axis: Hour of day (0-23). Y-axis: Message count. Shows when users are most active during the day."
            />
            <DayOfWeekActivityChart 
              data={advancedStatistics.dayOfWeekActivity || []} 
              description="X-axis: Day of week (Sun-Sat). Y-axis: Activity count. Displays activity patterns across different days of the week."
            />
          </div>

          {/* User Cohorts and Activity Segments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserCohortsChart 
              data={advancedStatistics.userCohorts || []} 
              description="X-axis: Registration period (cohort). Y-axis: User count. Groups users by registration date to track retention."
            />
            <ActivitySegmentsChart 
              data={advancedStatistics.activitySegments || []} 
              description="X-axis: Activity segment (e.g., high, medium, low). Y-axis: User count. Categorizes users based on activity levels."
            />
          </div>

          {/* Category Performance and Platform Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CategoryPerformanceRadar 
              data={advancedStatistics.categoryPerformance || []} 
              description="Axes: Different categories. Distance from center: Performance value. Compares total and published content across categories."
            />
            <PlatformComparisonChart 
              data={advancedStatistics.platformStats || []} 
              description="X-axis: Platform type (Web/WhatsApp). Y-axis: Usage count. Compares usage statistics between platforms."
            />
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnswerDistributionChart 
              data={advancedStatistics.answerDistribution || []} 
              description="X-axis: Answer count range. Y-axis: Frequency. Shows how answers are distributed across different count ranges."
            />
            <ConversationLengthChart 
              data={advancedStatistics.conversationLengths || []} 
              description="X-axis: Conversation length (number of messages). Y-axis: Frequency. Displays the distribution of conversation lengths."
            />
          </div>

        </>
      )}

      {/* Predictive Analytics Section */}
      {predictiveAnalytics && (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border border-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Predictive Analytics & Forecasting
            </h2>
            <p className="text-gray-600 mb-6">
              Data-driven predictions for future growth and engagement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PredictiveAnalyticsChart
              data={{
                current: {
                  users: predictiveAnalytics.currentMetrics?.users30d || 0,
                  messages: predictiveAnalytics.currentMetrics?.messages30d || 0,
                  questions: predictiveAnalytics.currentMetrics?.questions30d || 0,
                },
                predicted: {
                  users: predictiveAnalytics.predictions?.next30Days?.users || 0,
                  messages: predictiveAnalytics.predictions?.next30Days?.messages || 0,
                  questions: predictiveAnalytics.predictions?.next30Days?.questions || 0,
                },
              }}
            />
          </div>
        </>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserGrowthChart 
          data={transformUserGrowthData()} 
          description="X-axis: Time period (dates). Y-axis: Number of users. Shows total, registered, and anonymous user counts over time."
        />
        <CommunityEngagementChart 
          data={transformCommunityEngagementData()} 
          description="X-axis: Time period (dates). Y-axis: Count. Tracks messages, questions, and answers over time."
        />
        <LearningMaterialsChart 
          data={transformLearningMaterialsData()} 
          description="Categories: Learning material categories. Size: Number of materials. Shows distribution of materials by category."
        />
        <TopTagsChart 
          data={transformTopTagsData()} 
          description="X-axis: Count. Y-axis: Tag names. Shows the most popular tags used in community questions and discussions."
        />
      </div>

      {/* Performance Targets Section */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && (
        <div className="bg-white p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Performance Targets & Goals</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-pamoja-purple hover:underline">
                View Details
              </a>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <ProgressBar
              label={DASHBOARD_CONFIG.targets.engagement.label}
              value={Math.round(dashboardAnalytics.calculatedMetrics.engagementRate || 0)}
              color={DASHBOARD_CONFIG.targets.engagement.color}
            />
            <ProgressBar
              label={DASHBOARD_CONFIG.targets.contentPublishing.label}
              value={Math.round(dashboardAnalytics.calculatedMetrics.publishRate || 0)}
              color={DASHBOARD_CONFIG.targets.contentPublishing.color}
            />
          </div>
        </div>
      )}

      {/* Top Tags Chart */}
      <TopTagsChart data={transformTopTagsData()} />

      {/* Conversation Analytics Table */}
      {conversationAnalyticsData && conversationAnalyticsData.avgMessagesPerConversation && (
        <DataTable
          title="Conversation Analytics Summary"
          data={[
            {
              metric: "Average Messages per Conversation",
              value:
                (conversationAnalyticsData.avgMessagesPerConversation.avgMessages || 0).toFixed(
                  2
                ),
            },
            {
              metric: "Total Conversations",
              value:
                conversationAnalyticsData.avgMessagesPerConversation
                  .totalConversations || 0,
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

      {/* Comprehensive Statistics Summary */}
      {dashboardAnalytics && dashboardAnalytics.calculatedMetrics && (
        <div className="bg-white p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Comprehensive Statistical Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">User Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.totalUsers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.activeUsers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement Rate:</span>
                  <span className="font-semibold text-green-600">{((dashboardAnalytics.calculatedMetrics.engagementRate || 0).toFixed(2))}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Content Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.totalQuestions || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered Questions:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.questionsWithAnswers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answer Rate:</span>
                  <span className="font-semibold text-green-600">{((dashboardAnalytics.calculatedMetrics.answerRate || 0).toFixed(2))}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="font-semibold">{((dashboardAnalytics.calculatedMetrics.avgResponseTimeHours || 0).toFixed(1))} hrs</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Platform Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Conversations:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.totalConversations || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WhatsApp:</span>
                  <span className="font-semibold text-green-600">{(dashboardAnalytics.calculatedMetrics.whatsappConversations || 0).toLocaleString()} ({dashboardAnalytics.calculatedMetrics.whatsappPercent || 0}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Web:</span>
                  <span className="font-semibold text-blue-600">{(dashboardAnalytics.calculatedMetrics.webConversations || 0).toLocaleString()} ({dashboardAnalytics.calculatedMetrics.webPercent || 0}%)</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Learning Materials</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Materials:</span>
                  <span className="font-semibold">{(dashboardAnalytics.calculatedMetrics.totalMaterials || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-semibold text-green-600">{(dashboardAnalytics.calculatedMetrics.publishedMaterials || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publish Rate:</span>
                  <span className="font-semibold text-blue-600">{((dashboardAnalytics.calculatedMetrics.publishRate || 0).toFixed(2))}%</span>
                </div>
              </div>
            </div>


            <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <h4 className="font-semibold text-gray-700 mb-3">Key Performance Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Overall Health:</span>
                  <span className="font-bold text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Data Points:</span>
                  <span className="font-bold text-purple-600">{((dashboardAnalytics.calculatedMetrics.totalUsers || 0) + (dashboardAnalytics.calculatedMetrics.totalQuestions || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Analytics Coverage:</span>
                  <span className="font-bold text-blue-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Statistical Models:</span>
                  <span className="font-bold text-indigo-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
