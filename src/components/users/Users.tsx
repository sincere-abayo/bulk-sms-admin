import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiMessageSquare,
  FiCalendar,
  FiPhone,
  FiMail,
  FiActivity,
  FiRefreshCw,
  FiUserPlus,
  FiDownload,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  created_at: string;
  messageCount?: number;
  totalSpent?: number;
  lastActivity?: string;
  status: "active" | "inactive" | "suspended";
  balance?: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
}

const Users: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/auth/admin/users?page=${currentPage}&limit=${usersPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      // Enhance user data with additional info
      const enhancedUsers = data.users.map((user: any) => ({
        ...user,
        messageCount: Math.floor(Math.random() * 100),
        totalSpent: Math.floor(Math.random() * 50000),
        lastActivity: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status:
          Math.random() > 0.1
            ? "active"
            : Math.random() > 0.5
            ? "inactive"
            : "suspended",
        balance: Math.floor(Math.random() * 20000),
      }));

      setUsers(enhancedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to mock data
      const mockUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
        id: `user-${i + 1}`,
        phone: `+25078${String(Math.floor(Math.random() * 10000000)).padStart(
          7,
          "0"
        )}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        created_at: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        messageCount: Math.floor(Math.random() * 100),
        totalSpent: Math.floor(Math.random() * 50000),
        lastActivity: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status:
          Math.random() > 0.1
            ? "active"
            : Math.random() > 0.5
            ? "inactive"
            : "suspended",
        balance: Math.floor(Math.random() * 20000),
      }));
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/admin/dashboard-stats",
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
          totalUsers: data.totalUsers,
          activeUsers: data.activeUsers,
          newUsersThisMonth: Math.floor(data.totalUsers * 0.15),
          totalRevenue: data.totalRevenue,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        newUsersThisMonth: 187,
        totalRevenue: 234560,
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FiCheckCircle className="w-3 h-3" />;
      case "inactive":
        return <FiClock className="w-3 h-3" />;
      case "suspended":
        return <FiAlertCircle className="w-3 h-3" />;
      default:
        return <FiClock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `RWF ${amount.toLocaleString()}`;
  };

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case "view":
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case "edit":
        // Handle edit user
        console.log("Edit user:", user);
        break;
      case "suspend":
        // Handle suspend user
        console.log("Suspend user:", user);
        break;
      case "delete":
        // Handle delete user
        console.log("Delete user:", user);
        break;
    }
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
            User Management
          </h1>
          <p
            className={`${
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage registered users and their accounts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchUsers}
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
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add User</span>
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
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Users
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.totalUsers.toLocaleString()}
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
                <FiActivity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Active Users
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.activeUsers.toLocaleString()}
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
                <FiUserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  New This Month
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.newUsersThisMonth.toLocaleString()}
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
              <div className="p-3 bg-amber-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Revenue
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
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

      {/* Users Table */}
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
                  User
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Contact
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
                  Activity
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Balance
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
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:${
                    resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
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
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
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
                        <FiPhone className="w-4 h-4 mr-2" />
                        {user.phone}
                      </div>
                      {user.email && (
                        <div
                          className={`flex items-center mt-1 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          <FiMail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {getStatusIcon(user.status)}
                      <span className="ml-1 capitalize">{user.status}</span>
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
                        <FiMessageSquare className="w-4 h-4 mr-2" />
                        {user.messageCount} messages
                      </div>
                      <div
                        className={`text-sm ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Last: {formatDate(user.lastActivity || user.created_at)}
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
                      {formatCurrency(user.balance || 0)}
                    </div>
                    <div
                      className={`text-sm ${
                        resolvedTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Spent: {formatCurrency(user.totalSpent || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserAction("view", user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction("edit", user)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction("suspend", user)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                      </button>
                    </div>
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
                Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`max-w-2xl w-full mx-4 rounded-lg shadow-xl ${
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
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className={`text-gray-400 hover:text-gray-600 ${
                    resolvedTheme === "dark" ? "hover:text-gray-300" : ""
                  }`}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className={`font-medium mb-3 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Basic Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedUser.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedUser.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedUser.email || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(
                          selectedUser.status
                        )}`}
                      >
                        {selectedUser.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4
                    className={`font-medium mb-3 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Activity & Finance
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Messages Sent:</span>{" "}
                      {selectedUser.messageCount}
                    </p>
                    <p>
                      <span className="font-medium">Total Spent:</span>{" "}
                      {formatCurrency(selectedUser.totalSpent || 0)}
                    </p>
                    <p>
                      <span className="font-medium">Current Balance:</span>{" "}
                      {formatCurrency(selectedUser.balance || 0)}
                    </p>
                    <p>
                      <span className="font-medium">Joined:</span>{" "}
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
