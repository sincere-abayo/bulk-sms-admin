import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiMessageSquare,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiActivity,
  FiTarget,
  FiBarChart,
  FiPieChart,
  FiGlobe,
  FiClock,
  FiFilter,
} from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
    growth: number;
  };
  messageVolume: {
    labels: string[];
    data: number[];
    growth: number;
  };
  revenue: {
    labels: string[];
    data: number[];
    growth: number;
  };
  deliveryRates: {
    successful: number;
    failed: number;
    pending: number;
  };
  topUsers: Array<{
    id: string;
    name: string;
    phone: string;
    messageCount: number;
    revenue: number;
  }>;
  geographicData: Array<{
    region: string;
    users: number;
    messages: number;
    revenue: number;
  }>;
  hourlyActivity: {
    labels: string[];
    data: number[];
  };
  deviceTypes: {
    mobile: number;
    web: number;
  };
}

interface KPICard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const Analytics: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // In a real app, this would be multiple API calls
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/revenue`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the data for our analytics
        setAnalyticsData(generateMockAnalytics(data));
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Fallback to mock data
      setAnalyticsData(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = (apiData?: any): AnalyticsData => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    });

    return {
      userGrowth: {
        labels: dateRange === "30d" ? last30Days : last12Months,
        data: Array.from(
          { length: dateRange === "30d" ? 30 : 12 },
          () => Math.floor(Math.random() * 50) + 10
        ),
        growth: 12.5,
      },
      messageVolume: {
        labels: dateRange === "30d" ? last30Days : last12Months,
        data: Array.from(
          { length: dateRange === "30d" ? 30 : 12 },
          () => Math.floor(Math.random() * 2000) + 500
        ),
        growth: 18.3,
      },
      revenue: {
        labels: dateRange === "30d" ? last30Days : last12Months,
        data: Array.from(
          { length: dateRange === "30d" ? 30 : 12 },
          () => Math.floor(Math.random() * 50000) + 10000
        ),
        growth: 15.7,
      },
      deliveryRates: {
        successful: 87.5,
        failed: 8.2,
        pending: 4.3,
      },
      topUsers: Array.from({ length: 10 }, (_, i) => ({
        id: `user-${i + 1}`,
        name: `Top User ${i + 1}`,
        phone: `+25078${String(Math.floor(Math.random() * 10000000)).padStart(
          7,
          "0"
        )}`,
        messageCount: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 25000) + 5000,
      })),
      geographicData: [
        { region: "Kigali", users: 450, messages: 12500, revenue: 187500 },
        {
          region: "Northern Province",
          users: 280,
          messages: 7800,
          revenue: 117000,
        },
        {
          region: "Southern Province",
          users: 320,
          messages: 8900,
          revenue: 133500,
        },
        {
          region: "Eastern Province",
          users: 190,
          messages: 5200,
          revenue: 78000,
        },
        {
          region: "Western Province",
          users: 160,
          messages: 4300,
          revenue: 64500,
        },
      ],
      hourlyActivity: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        data: Array.from(
          { length: 24 },
          () => Math.floor(Math.random() * 200) + 50
        ),
      },
      deviceTypes: {
        mobile: 75,
        web: 25,
      },
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: resolvedTheme === "dark" ? "#e2e8f0" : "#1e293b",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color:
            resolvedTheme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: resolvedTheme === "dark" ? "#94a3b8" : "#64748b",
        },
      },
      y: {
        grid: {
          color:
            resolvedTheme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: resolvedTheme === "dark" ? "#94a3b8" : "#64748b",
        },
      },
    },
  };

  const kpiCards: KPICard[] = analyticsData
    ? [
        {
          title: "Total Revenue",
          value: `RWF ${analyticsData.revenue.data
            .reduce((a, b) => a + b, 0)
            .toLocaleString()}`,
          change: analyticsData.revenue.growth,
          icon: <FiDollarSign className="w-6 h-6" />,
          color: "text-green-600",
        },
        {
          title: "Active Users",
          value: analyticsData.userGrowth.data
            .reduce((a, b) => a + b, 0)
            .toLocaleString(),
          change: analyticsData.userGrowth.growth,
          icon: <FiUsers className="w-6 h-6" />,
          color: "text-blue-600",
        },
        {
          title: "Messages Sent",
          value: analyticsData.messageVolume.data
            .reduce((a, b) => a + b, 0)
            .toLocaleString(),
          change: analyticsData.messageVolume.growth,
          icon: <FiMessageSquare className="w-6 h-6" />,
          color: "text-purple-600",
        },
        {
          title: "Delivery Rate",
          value: `${analyticsData.deliveryRates.successful}%`,
          change: 2.1,
          icon: <FiTarget className="w-6 h-6" />,
          color: "text-amber-600",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 p-6 ${
        resolvedTheme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Analytics Dashboard
          </h1>
          <p
            className={`${
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              resolvedTheme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              resolvedTheme === "dark"
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-300"
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              resolvedTheme === "dark"
                ? "border-gray-700 hover:bg-gray-700"
                : "border-gray-300"
            }`}
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 shadow-sm border ${
              resolvedTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {kpi.title}
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {kpi.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpi.change >= 0 ? (
                    <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      kpi.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change >= 0 ? "+" : ""}
                    {kpi.change}%
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      resolvedTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    vs last period
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${kpi.color
                  .replace("text-", "bg-")
                  .replace("-600", "-100")}`}
              >
                <div className={kpi.color}>{kpi.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Revenue Trend
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">
                +{analyticsData?.revenue.growth}%
              </span>
            </div>
          </div>
          <div className="h-64">
            {analyticsData && (
              <Line
                data={{
                  labels: analyticsData.revenue.labels,
                  datasets: [
                    {
                      label: "Revenue (RWF)",
                      data: analyticsData.revenue.data,
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        {/* Message Volume */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Message Volume
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600 font-medium">
                +{analyticsData?.messageVolume.growth}%
              </span>
            </div>
          </div>
          <div className="h-64">
            {analyticsData && (
              <Bar
                data={{
                  labels: analyticsData.messageVolume.labels,
                  datasets: [
                    {
                      label: "Messages",
                      data: analyticsData.messageVolume.data,
                      backgroundColor: "#3b82f6",
                      borderRadius: 4,
                    },
                  ],
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        {/* Delivery Status Distribution */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-6 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Delivery Status Distribution
          </h3>
          <div className="h-64">
            {analyticsData && (
              <Doughnut
                data={{
                  labels: ["Successful", "Failed", "Pending"],
                  datasets: [
                    {
                      data: [
                        analyticsData.deliveryRates.successful,
                        analyticsData.deliveryRates.failed,
                        analyticsData.deliveryRates.pending,
                      ],
                      backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: resolvedTheme === "dark" ? "#e2e8f0" : "#1e293b",
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Hourly Activity */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-6 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Hourly Activity Pattern
          </h3>
          <div className="h-64">
            {analyticsData && (
              <Line
                data={{
                  labels: analyticsData.hourlyActivity.labels,
                  datasets: [
                    {
                      label: "Messages per Hour",
                      data: analyticsData.hourlyActivity.data,
                      borderColor: "#8b5cf6",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-6 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Top Users by Revenue
          </h3>
          <div className="space-y-4">
            {analyticsData?.topUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {user.name}
                    </div>
                    <div
                      className={`text-sm ${
                        resolvedTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {user.messageCount} messages
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    RWF {user.revenue.toLocaleString()}
                  </div>
                  <div
                    className={`text-xs ${
                      resolvedTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-6 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Geographic Distribution
          </h3>
          <div className="space-y-4">
            {analyticsData?.geographicData.map((region, index) => (
              <div
                key={region.region}
                className="flex items-center justify-between"
              >
                <div>
                  <div
                    className={`text-sm font-medium ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {region.region}
                  </div>
                  <div
                    className={`text-sm ${
                      resolvedTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {region.users} users • {region.messages.toLocaleString()}{" "}
                    messages
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    RWF {region.revenue.toLocaleString()}
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (region.users /
                            Math.max(
                              ...analyticsData.geographicData.map(
                                (r) => r.users
                              )
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-6 ${
            resolvedTheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {analyticsData?.deliveryRates.successful}%
            </div>
            <div
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Average Delivery Rate
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${analyticsData?.deliveryRates.successful}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              2.3s
            </div>
            <div
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Average Response Time
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              99.2%
            </div>
            <div
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              System Uptime
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "99.2%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
