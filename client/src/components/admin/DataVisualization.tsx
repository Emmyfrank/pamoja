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
} from "recharts";

interface ChartProps {
  data: any[];
  height?: number;
  className?: string;
}

// User Growth Chart
export const UserGrowthChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
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
            stroke="#AA60C8"
            fill="#AA60C8"
            fillOpacity={0.3}
            name="Total Users"
          />
          <Area
            type="monotone"
            dataKey="registered"
            stackId="2"
            stroke="#D69ADE"
            fill="#D69ADE"
            fillOpacity={0.3}
            name="Registered Users"
          />
          <Area
            type="monotone"
            dataKey="anonymous"
            stackId="3"
            stroke="#EABDE6"
            fill="#EABDE6"
            fillOpacity={0.3}
            name="Anonymous Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Community Engagement Chart
export const CommunityEngagementChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
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
            stroke="#AA60C8"
            strokeWidth={2}
            name="Messages"
          />
          <Line
            type="monotone"
            dataKey="questions"
            stroke="#D69ADE"
            strokeWidth={2}
            name="Questions"
          />
          <Line
            type="monotone"
            dataKey="answers"
            stroke="#EABDE6"
            strokeWidth={2}
            name="Answers"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Conversation Analytics Chart
export const ConversationAnalyticsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
}) => {
  return (
    <div className={`bg-white p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Conversation Analytics</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
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
          <Bar dataKey="web" fill="#AA60C8" name="Web Conversations" />
          <Bar
            dataKey="whatsapp"
            fill="#D69ADE"
            name="WhatsApp Conversations"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Learning Materials Chart
export const LearningMaterialsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
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
                fill={index % 2 === 0 ? "#AA60C8" : "#D69ADE"}
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
    </div>
  );
};

// Top Tags Chart
export const TopTagsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = "",
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
          <Bar dataKey="count" fill="#AA60C8" />
        </BarChart>
      </ResponsiveContainer>
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
