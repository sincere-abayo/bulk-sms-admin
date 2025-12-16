import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  FiUsers,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiAlertCircle,
  FiBarChart,
  FiSettings,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
} from "react-icons/fi";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface DashboardStats {
  totalUsers: number;
  totalMessages: number;
  totalRevenue: number;
  activeUsers: number;
  pendingMessages: number;
  systemAlerts: number;
  growthRate: number;
  monthlyRevenue: number;
  currency?: string;
}

const Dashboard: React.FC = () => {
  const { resolvedTheme } = useTheme();

  const chartOptions = useMemo(
    () => ({
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
    }),
    [resolvedTheme]
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback to mock data if API fails
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        totalMessages: 15680,
        totalRevenue: 234560,
        activeUsers: 892,
        pendingMessages: 23,
        systemAlerts: 3,
        growthRate: 12.5,
        monthlyRevenue: 45670,
        currency: "RWF",
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendType?: "positive" | "negative" | "neutral";
    color: string;
  }> = ({ title, value, icon, trend, trendType = "neutral", color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-3">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  trendType === "positive"
                    ? "bg-green-100 text-green-800"
                    : trendType === "negative"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {trendType === "positive" && (
                  <FiArrowUp className="w-3 h-3 mr-1" />
                )}
                {trendType === "negative" && (
                  <FiArrowDown className="w-3 h-3 mr-1" />
                )}
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${color
            .replace("text-", "bg-")
            .replace("-600", "-50")}`}
        >
          <div className={color}>{icon}</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8 fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-32 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-24"></div>
                  <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-16"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card animate-pulse">
            <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-24"></div>
                    <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-32"></div>
                  </div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card animate-pulse">
            <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-28 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 space-y-6 bg-background text-foreground`}>
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${
                resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Dashboard Overview
            </h1>
            <p
              className={`text-gray-600 mt-1 text-sm md:text-base ${
                resolvedTheme === "dark" ? "text-gray-400" : ""
              }`}
            >
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className={`flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 shadow-sm`}
              onClick={fetchDashboardStats}
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<FiUsers className="w-6 h-6" />}
            trend="+12.5%"
            trendType="positive"
            color="text-blue-600"
          />
          <StatCard
            title="Total Messages"
            value={stats?.totalMessages || 0}
            icon={<FiMessageSquare className="w-6 h-6" />}
            trend="+8.2%"
            trendType="positive"
            color="text-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={`${stats?.currency || "RWF"} ${(
              stats?.totalRevenue || 0
            ).toLocaleString()}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            trend="+15.3%"
            trendType="positive"
            color="text-purple-600"
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={<FiActivity className="w-6 h-6" />}
            trend="+5.7%"
            trendType="positive"
            color="text-amber-600"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Analytics Section */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
              }`}
            >
              User Growth
            </h3>
            <span
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last 6 months
            </span>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "New Users",
                    data: [450, 520, 480, 610, 550, 670],
                    backgroundColor: "#3b82f6",
                    borderRadius: 4,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Recent Activity
            </h3>
            <span
              className={`text-sm text-blue-600 hover:text-blue-800 cursor-pointer ${
                resolvedTheme === "dark" ? "text-gray-400" : ""
              }`}
            >
              View All
            </span>
          </div>
          <div className="space-y-4">
            {[
              {
                id: 1,
                user: "John Doe",
                action: "sent a campaign",
                time: "2 min ago",
                status: "success",
              },
              {
                id: 2,
                user: "Jane Smith",
                action: "topped up balance",
                time: "15 min ago",
                status: "success",
              },
              {
                id: 3,
                user: "Robert Johnson",
                action: "created a contact list",
                time: "1 hour ago",
                status: "info",
              },
              {
                id: 4,
                user: "System",
                action: "scheduled maintenance",
                time: "2 hours ago",
                status: "warning",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    item.status === "success"
                      ? "bg-green-500"
                      : item.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      resolvedTheme === "dark"
                        ? "text-gray-200"
                        : "text-gray-900"
                    }`}
                  >
                    {item.user}
                  </p>
                  <p
                    className={`text-sm ${
                      resolvedTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {item.action}
                  </p>
                </div>
                <span
                  className={`text-xs ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Quick Actions
            </h3>
            <span
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Frequently used
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex flex-col items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mb-2">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Manage Users
              </span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mb-2">
                <FiMessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Send Message
              </span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mb-2">
                <FiDollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Add Funds
              </span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`}
            >
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg mb-2">
                <FiSettings className="w-5 h-5 text-amber-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card rounded-xl shadow-sm p-6 border border-border mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-semibold ${
              resolvedTheme === "dark" ? "text-gray-200" : "text-gray-900"
            }`}
          >
            System Status
          </h3>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span
              className={`text-sm text-green-600 font-medium ${
                resolvedTheme === "dark" ? "text-gray-400" : ""
              }`}
            >
              All Systems Operational
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-foreground">
          {[
            {
              service: "SMS Gateway",
              status: "operational",
              uptime: "99.9%",
              responseTime: "120ms",
            },
            {
              service: "Database",
              status: "operational",
              uptime: "99.8%",
              responseTime: "45ms",
            },
            {
              service: "API Services",
              status: "operational",
              uptime: "99.7%",
              responseTime: "89ms",
            },
            {
              service: "Payment Gateway",
              status: "operational",
              uptime: "99.5%",
              responseTime: "156ms",
            },
          ].map((service, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {service.service}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uptime</span>
                <span className="font-medium">{service.uptime}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Response</span>
                <span className="font-medium">{service.responseTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
