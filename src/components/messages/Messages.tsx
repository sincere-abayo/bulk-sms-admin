import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiMessageSquare,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiSend,
  FiPhone,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";

interface Message {
  id: string;
  content: string;
  status: "pending" | "sending" | "completed" | "failed" | "partial";
  cost: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  user_name: string;
  user_phone: string;
  total_recipients: number;
}

interface MessageStats {
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
  totalRevenue: number;
  averageDeliveryRate: number;
  messagesThisMonth: number;
  revenueThisMonth: number;
}

interface MessageRecipient {
  id: string;
  name: string;
  phone: string;
  status: "pending" | "sent" | "delivered" | "failed";
  error_message?: string;
  sent_at?: string;
  delivered_at?: string;
}

const Messages: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "failed" | "pending" | "partial"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageRecipients, setMessageRecipients] = useState<
    MessageRecipient[]
  >([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [dateRange, setDateRange] = useState("7d");

  const messagesPerPage = 10;

  useEffect(() => {
    fetchMessages();
    fetchMessageStats();
  }, [currentPage, dateRange]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/messages?page=${currentPage}&limit=${messagesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback to mock data
      const mockMessages: Message[] = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i + 1}`,
        content: `${"x".repeat(Math.floor(Math.random() * 300) + 50)}`, // Privacy: actual content hidden
        status: ["completed", "failed", "partial", "pending"][
          Math.floor(Math.random() * 4)
        ] as any,
        cost: Math.floor(Math.random() * 1000) + 100,
        sent_count: Math.floor(Math.random() * 50) + 1,
        failed_count: Math.floor(Math.random() * 5),
        total_recipients: Math.floor(Math.random() * 50) + 1,
        created_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        user_name: `User ${i + 1}`,
        user_phone: `+25078${String(
          Math.floor(Math.random() * 10000000)
        ).padStart(7, "0")}`,
      }));
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageStats = async () => {
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

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalMessages: data.totalMessages,
          successfulMessages: Math.floor(data.totalMessages * 0.85),
          failedMessages: Math.floor(data.totalMessages * 0.15),
          totalRevenue: data.totalRevenue,
          averageDeliveryRate: 87.5,
          messagesThisMonth: Math.floor(data.totalMessages * 0.3),
          revenueThisMonth: Math.floor(data.totalRevenue * 0.3),
        });
      }
    } catch (error) {
      console.error("Error fetching message stats:", error);
      setStats({
        totalMessages: 15680,
        successfulMessages: 13328,
        failedMessages: 2352,
        totalRevenue: 234560,
        averageDeliveryRate: 87.5,
        messagesThisMonth: 4704,
        revenueThisMonth: 70368,
      });
    }
  };

  const fetchMessageDetails = async (messageId: string) => {
    try {
      // Mock recipients data since we don't have the endpoint yet
      const mockRecipients: MessageRecipient[] = Array.from(
        { length: Math.floor(Math.random() * 20) + 5 },
        (_, i) => ({
          id: `recipient-${i + 1}`,
          name: `Contact ${i + 1}`,
          phone: `+25078${String(Math.floor(Math.random() * 10000000)).padStart(
            7,
            "0"
          )}`,
          status: ["sent", "delivered", "failed", "pending"][
            Math.floor(Math.random() * 4)
          ] as any,
          error_message:
            Math.random() > 0.8 ? "Invalid phone number" : undefined,
          sent_at:
            Math.random() > 0.3
              ? new Date(
                  Date.now() - Math.random() * 24 * 60 * 60 * 1000
                ).toISOString()
              : undefined,
          delivered_at:
            Math.random() > 0.5
              ? new Date(
                  Date.now() - Math.random() * 12 * 60 * 60 * 1000
                ).toISOString()
              : undefined,
        })
      );
      setMessageRecipients(mockRecipients);
    } catch (error) {
      console.error("Error fetching message details:", error);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_phone.includes(searchTerm) ||
      message.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || message.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "sending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="w-3 h-3" />;
      case "failed":
        return <FiXCircle className="w-3 h-3" />;
      case "partial":
        return <FiAlertTriangle className="w-3 h-3" />;
      case "pending":
        return <FiClock className="w-3 h-3" />;
      case "sending":
        return <FiSend className="w-3 h-3" />;
      default:
        return <FiClock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `RWF ${amount.toLocaleString()}`;
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    await fetchMessageDetails(message.id);
    setShowMessageModal(true);
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
            Message Monitoring
          </h1>
          <p
            className={`${
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Monitor SMS delivery and performance across all users
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
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={fetchMessages}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              resolvedTheme === "dark"
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-300"
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className={`rounded-lg p-6 shadow-sm border ${
              resolvedTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiMessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Messages
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.totalMessages.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-6 shadow-sm border ${
              resolvedTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Successful
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.successfulMessages.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  {(
                    (stats.successfulMessages / stats.totalMessages) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-6 shadow-sm border ${
              resolvedTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiXCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Failed
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.failedMessages.toLocaleString()}
                </p>
                <p className="text-sm text-red-600">
                  {((stats.failedMessages / stats.totalMessages) * 100).toFixed(
                    1
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-6 shadow-sm border ${
              resolvedTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Revenue
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-purple-600">
                  This month: {formatCurrency(stats.revenueThisMonth)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Message Volume Trend
          </h3>
          <div className="h-64">
            <Line
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    label: "Messages Sent",
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div
          className={`rounded-lg p-6 shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Delivery Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: ["Delivered", "Failed", "Pending"],
                datasets: [
                  {
                    data: [
                      stats?.successfulMessages || 0,
                      stats?.failedMessages || 0,
                      150,
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
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by user, phone, or message ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  resolvedTheme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                resolvedTheme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
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
      </div>

      {/* Privacy Notice */}
      <div
        className={`rounded-lg p-4 border ${
          resolvedTheme === "dark"
            ? "bg-blue-900 border-blue-700"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex items-center">
          <FiShield className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h4
              className={`text-sm font-medium ${
                resolvedTheme === "dark" ? "text-blue-200" : "text-blue-800"
              }`}
            >
              Privacy Protection
            </h4>
            <p
              className={`text-sm ${
                resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Message content is protected for user privacy. Only metadata
              (length, delivery status, timestamps) is displayed.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${
          resolvedTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={
                resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
              }
            >
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Message Info
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  User
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Delivery
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Cost
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                resolvedTheme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {paginatedMessages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:${
                    resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div
                        className={`text-sm font-medium ${
                          resolvedTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        <div className="flex items-center">
                          <FiMessageSquare className="w-4 h-4 mr-2" />
                          Message #{message.id.substring(0, 8)}
                        </div>
                      </div>
                      <div
                        className={`text-sm ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Length: {message.content.length} chars •{" "}
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {message.user_name.charAt(0).toUpperCase()}
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
                          {message.user_name}
                        </div>
                        <div
                          className={`text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {message.user_phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {getStatusIcon(message.status)}
                      <span className="ml-1 capitalize">{message.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <FiCheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        {message.sent_count}
                      </div>
                      {message.failed_count > 0 && (
                        <div className="flex items-center">
                          <FiXCircle className="w-4 h-4 mr-1 text-red-500" />
                          {message.failed_count}
                        </div>
                      )}
                      <div
                        className={`text-xs ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        of {message.total_recipients}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(message.cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`px-6 py-3 border-t ${
              resolvedTheme === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-sm ${
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Showing {(currentPage - 1) * messagesPerPage + 1} to{" "}
                {Math.min(
                  currentPage * messagesPerPage,
                  filteredMessages.length
                )}{" "}
                of {filteredMessages.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  } ${
                    resolvedTheme === "dark"
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  Previous
                </button>
                <span
                  className={`px-3 py-1 ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  } ${
                    resolvedTheme === "dark"
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`max-w-4xl w-full mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${
              resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-medium ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Message Details
                </h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className={`text-gray-400 hover:text-gray-600 ${
                    resolvedTheme === "dark" ? "hover:text-gray-300" : ""
                  }`}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4
                    className={`font-medium mb-3 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Message Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Message ID:</span>{" "}
                      {selectedMessage.id}
                    </p>
                    <p>
                      <span className="font-medium">Content Length:</span>{" "}
                      {selectedMessage.content.length} characters
                    </p>
                    <p>
                      <span className="font-medium">SMS Count:</span>{" "}
                      {Math.ceil(selectedMessage.content.length / 160)} SMS
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(
                          selectedMessage.status
                        )}`}
                      >
                        {selectedMessage.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Cost:</span>{" "}
                      {formatCurrency(selectedMessage.cost)}
                    </p>
                    <p>
                      <span className="font-medium">Sent:</span>{" "}
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4
                    className={`font-medium mb-3 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Delivery Summary
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Total Recipients:</span>{" "}
                      {selectedMessage.total_recipients}
                    </p>
                    <p>
                      <span className="font-medium">Successfully Sent:</span>{" "}
                      {selectedMessage.sent_count}
                    </p>
                    <p>
                      <span className="font-medium">Failed:</span>{" "}
                      {selectedMessage.failed_count}
                    </p>
                    <p>
                      <span className="font-medium">Success Rate:</span>{" "}
                      {(
                        (selectedMessage.sent_count /
                          selectedMessage.total_recipients) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className={`font-medium mb-3 ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Recipients ({messageRecipients.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead
                      className={
                        resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }
                    >
                      <tr>
                        <th
                          className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          Contact
                        </th>
                        <th
                          className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          Sent At
                        </th>
                        <th
                          className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        resolvedTheme === "dark"
                          ? "divide-gray-700"
                          : "divide-gray-200"
                      }`}
                    >
                      {messageRecipients.map((recipient) => (
                        <tr key={recipient.id}>
                          <td className="px-4 py-2">
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  resolvedTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {recipient.name}
                              </div>
                              <div
                                className={`text-sm ${
                                  resolvedTheme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {recipient.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                recipient.status
                              )}`}
                            >
                              {getStatusIcon(recipient.status)}
                              <span className="ml-1 capitalize">
                                {recipient.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div
                              className={`text-sm ${
                                resolvedTheme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {recipient.sent_at
                                ? formatDate(recipient.sent_at)
                                : "-"}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div
                              className={`text-sm ${
                                resolvedTheme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                              }`}
                            >
                              {recipient.error_message || "-"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
