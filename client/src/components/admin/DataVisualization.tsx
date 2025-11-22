import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

interface ChartProps {
  data: any[];
  height?: number;
  className?: string;
  description?: string;
}

// User Growth Chart
export const UserGrowthChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">User Growth Over Time</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
            name="Total Users"
          />
          <Area
            type="monotone"
            dataKey="registered"
            stackId="2"
            stroke="#0d9488"
            fill="#0d9488"
            fillOpacity={0.3}
            name="Registered Users"
          />
          <Area
            type="monotone"
            dataKey="anonymous"
            stackId="3"
            stroke="#64748b"
            fill="#64748b"
            fillOpacity={0.3}
            name="Anonymous Users"
          />
        </AreaChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Community Engagement Chart
export const CommunityEngagementChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Community Engagement</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="messages"
            stroke="#2563eb"
            strokeWidth={2}
            name="Messages"
          />
          <Line
            type="monotone"
            dataKey="questions"
            stroke="#0d9488"
            strokeWidth={2}
            name="Questions"
          />
          <Line
            type="monotone"
            dataKey="answers"
            stroke="#16a34a"
            strokeWidth={2}
            name="Answers"
          />
        </LineChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Conversation Analytics Chart - Combo Chart (Bar + Line)
export const ConversationAnalyticsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis yAxisId="left" stroke="#666" fontSize={12} label={{ value: "Web Conversations", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} label={{ value: "WhatsApp", angle: 90, position: "insideRight" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="web" fill="#2563eb" name="Web Conversations" />
          <Line yAxisId="right" type="monotone" dataKey="whatsapp" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a", r: 4 }} name="WhatsApp Conversations" />
        </ComposedChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Learning Materials Chart
export const LearningMaterialsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">
        Learning Materials by Category
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#2563eb" : "#0d9488"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Top Tags Chart
export const TopTagsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Top Community Tags</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#666" fontSize={12} />
          <YAxis
            dataKey="tag"
            type="category"
            stroke="#666"
            fontSize={12}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Metrics Cards Component
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  className = "",
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return "↗";
      case "decrease":
        return "↘";
      default:
        return "";
    }
  };

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {change !== undefined && (
          <span className={`text-sm ${getChangeColor()}`}>
            {getChangeIcon()} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

// Data Table Component
interface DataTableProps {
  title: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  className = "",
}) => {
  return (
    <div className={`bg-white border border-gray-100 ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="pb-3 px-6 font-medium text-gray-600"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Circular Progress Gauge Component
interface GaugeProps {
  value: number;
  max?: number;
  title: string;
  subtitle?: string;
  height?: number;
  className?: string;
  color?: string;
}

export const GaugeChart: React.FC<GaugeProps> = ({
  value,
  max = 100,
  title,
  subtitle,
  height = 250,
  className = "",
  color = "#2563eb",
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="relative">
          <svg width={200} height={200} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={100}
              cy={100}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={12}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={100}
              cy={100}
              r={radius}
              stroke={color}
              strokeWidth={12}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{value}%</span>
            <span className="text-sm text-gray-500 mt-1">of {max}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color = "#2563eb",
  showValue = true,
  className = "",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm font-semibold text-gray-900">{value}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

// Metric Card with Circular Progress
interface MetricCardWithProgressProps {
  title: string;
  value: string | number;
  progress: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  className?: string;
  color?: string;
  description?: string;
}

export const MetricCardWithProgress: React.FC<MetricCardWithProgressProps> = ({
  title,
  value,
  progress,
  change,
  changeType = "neutral",
  className = "",
  color = "#2563eb",
  description,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return "▲";
      case "decrease":
        return "▼";
      default:
        return "";
    }
  };

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h4 className="text-sm font-medium text-gray-600 mb-4">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {change !== undefined && (
            <span className={`text-sm ${getChangeColor()}`}>
              {getChangeIcon()} {Math.abs(change)}%
            </span>
          )}
        </div>
        <div className="relative w-20 h-20">
          <svg width={80} height={80} className="transform -rotate-90">
            <circle
              cx={40}
              cy={40}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={6}
              fill="none"
            />
            <circle
              cx={40}
              cy={40}
              r={radius}
              stroke={color}
              strokeWidth={6}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900">{progress}</span>
          </div>
        </div>
      </div>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Hourly Activity Chart
export const HourlyActivityChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Activity by Hour of Day</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="count" fill="#AA60C8" name="Messages" />
        </BarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Day of Week Activity Chart
export const DayOfWeekActivityChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedData = data.map(item => ({
    day: dayNames[item.day - 1] || `Day ${item.day}`,
    count: item.count,
  }));

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Activity by Day of Week</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="count" fill="#0d9488" name="Activity" />
        </BarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Category Performance Radar Chart
export const CategoryPerformanceRadar: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  const radarData = data.map(item => ({
    category: item.category?.replace(/_/g, " ") || "Unknown",
    total: item.total,
    published: item.published,
    featured: item.featured,
  }));

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Category Performance Analysis</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" fontSize={10} />
          <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} />
          <Radar
            name="Total"
            dataKey="total"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.6}
          />
          <Radar
            name="Published"
            dataKey="published"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Answer Distribution Chart
export const AnswerDistributionChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Question Answer Distribution</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="answerCount" stroke="#666" fontSize={12} label={{ value: "Number of Answers", position: "insideBottom", offset: -5 }} />
          <YAxis stroke="#666" fontSize={12} label={{ value: "Questions", angle: -90, position: "insideLeft" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="questionCount" fill="#3b82f6" name="Questions" />
        </BarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Conversation Length Distribution
export const ConversationLengthChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Conversation Length Distribution</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="range" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="count" fill="#f97316" name="Conversations" />
        </BarChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Platform Comparison Chart
export const PlatformComparisonChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Platform Comparison</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="platform" stroke="#666" fontSize={12} />
          <YAxis yAxisId="left" stroke="#666" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="total" fill="#2563eb" name="Total Conversations" />
          <Line yAxisId="right" type="monotone" dataKey="avgMessages" stroke="#16a34a" strokeWidth={2} name="Avg Messages" />
        </ComposedChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// User Activity Segments Chart
export const ActivitySegmentsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  const COLORS = ["#2563eb", "#0d9488", "#16a34a", "#ea580c", "#64748b", "#4f46e5"];
  
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">User Activity Segments</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// User Cohorts Chart
export const UserCohortsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
  description,
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">User Registration Cohorts</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="period" stroke="#666" fontSize={12} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
            name="New Users"
          />
        </AreaChart>
      </ResponsiveContainer>
      {description && (
        <p className="text-sm text-gray-600 mt-4">{description}</p>
      )}
    </div>
  );
};

// Predictive Analytics Chart
interface PredictiveChartProps {
  data: {
    current: { users: number; messages: number; questions: number };
    predicted: { users: number; messages: number; questions: number };
  };
  height?: number;
  className?: string;
}

export const PredictiveAnalyticsChart: React.FC<PredictiveChartProps> = ({
  data,
  height = 300,
  className = "",
}) => {
  const chartData = [
    {
      metric: "Users",
      current: data.current.users,
      predicted: data.predicted.users,
    },
    {
      metric: "Messages",
      current: data.current.messages,
      predicted: data.predicted.messages,
    },
    {
      metric: "Questions",
      current: data.current.questions,
      predicted: data.predicted.questions,
    },
  ];

  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">30-Day Predictions</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="metric" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Bar dataKey="current" fill="#2563eb" name="Current (30d)" />
          <Bar dataKey="predicted" fill="#16a34a" name="Predicted (Next 30d)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Trend Indicators Component
interface TrendIndicatorsProps {
  userTrend: number;
  messageTrend: number;
  className?: string;
}

export const TrendIndicators: React.FC<TrendIndicatorsProps> = ({
  userTrend,
  messageTrend,
  className = "",
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600 mb-2">User Growth</div>
          <div className={`text-2xl font-bold ${userTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {userTrend >= 0 ? "↑" : "↓"} {Math.abs(userTrend)}%
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600 mb-2">Message Growth</div>
          <div className={`text-2xl font-bold ${messageTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {messageTrend >= 0 ? "↑" : "↓"} {Math.abs(messageTrend)}%
          </div>
        </div>
      </div>
    </div>
  );
};
