"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  getAdminDashboardStats,
  type DashboardResponse,
} from "@/utils/adminApi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFamilies: number;
  totalTransactions: number;
  totalBudgets: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Default placeholder data
const DEFAULT_USER_GROWTH_DATA = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 350 },
  { month: "Mar", users: 500 },
  { month: "Apr", users: 750 },
  { month: "May", users: 1000 },
  { month: "Jun", users: 1250 },
];

const DEFAULT_TRANSACTION_VOLUME_DATA = [
  { month: "Jan", transactions: 450 },
  { month: "Feb", transactions: 620 },
  { month: "Mar", transactions: 890 },
  { month: "Apr", transactions: 1200 },
  { month: "May", transactions: 1850 },
  { month: "Jun", transactions: 2340 },
];

const DEFAULT_CATEGORY_DATA = [
  { name: "Food & Dining", value: 2400 },
  { name: "Transportation", value: 1398 },
  { name: "Entertainment", value: 9800 },
  { name: "Utilities", value: 3908 },
  { name: "Others", value: 4800 },
];

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const previewMode = searchParams.get("preview") === "true";
  const adminToken = Cookies.get("adminToken");
  const userRole = Cookies.get("userRole");

  // Check authentication on mount
  useEffect(() => {
    if (!previewMode && (!adminToken || userRole !== "admin")) {
      router.push("/admin-sign-in");
    } else {
      setIsAuthenticated(true);
    }
  }, [previewMode, adminToken, userRole, router]);

  // Determine if we should fetch
  const shouldFetch = isAuthenticated && !previewMode;

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      console.log("[Admin Dashboard] Fetching stats from backend...");
      const result = await getAdminDashboardStats();
      console.log("[Admin Dashboard] Response received:", result);
      return result;
    },
    enabled: shouldFetch,
  });

  // Process and format data
  const adminStats: AdminStats = previewMode
    ? {
        totalUsers: 1250,
        activeUsers: 892,
        totalFamilies: 156,
        totalTransactions: 15420,
        totalBudgets: 3840,
      }
    : {
        totalUsers: response?.stats?.totalUsers || 0,
        activeUsers: response?.stats?.activeUsers || 0,
        totalFamilies: response?.stats?.totalFamilies || 0,
        totalTransactions: response?.stats?.totalTransactions || 0,
        totalBudgets: response?.stats?.totalBudgets || 0,
      };

  const userGrowthFormatted = previewMode
    ? DEFAULT_USER_GROWTH_DATA
    : response?.userGrowthData?.map((item) => ({
        month: `${item._id.month}/${item._id.year.toString().slice(-2)}`,
        users: item.count,
      })) || DEFAULT_USER_GROWTH_DATA;

  const transactionVolumeFormatted = previewMode
    ? DEFAULT_TRANSACTION_VOLUME_DATA
    : response?.transactionGrowthData?.map((item) => ({
        month: `${item._id.month}/${item._id.year.toString().slice(-2)}`,
        transactions: item.count,
      })) || DEFAULT_TRANSACTION_VOLUME_DATA;

  const categoryFormatted = previewMode
    ? DEFAULT_CATEGORY_DATA
    : response?.transactionByCategory?.map((item) => ({
        name: item._id || "Others",
        value: item.totalAmount,
      })) || DEFAULT_CATEGORY_DATA;

  const chartData = {
    userGrowth: userGrowthFormatted,
    transactionVolume: transactionVolumeFormatted,
    categoryData: categoryFormatted,
  };

  const handleLogout = () => {
    if (previewMode) {
      router.push("/");
      return;
    }
    Cookies.remove("adminToken");
    Cookies.remove("userRole");
    router.push("/admin-sign-in");
  };

  if (!isAuthenticated || (isLoading && !previewMode)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-heading3 font-sansation font-bold text-text-1000">
              Admin Dashboard
            </h1>
            <p className="text-text-600 font-nunitosans text-sm mt-1">
              Welcome back, Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-nunitosans font-bold transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Preview Mode Banner */}
      {previewMode && (
        <div className="bg-yellow-50 border-b-2 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-nunitosans text-yellow-800">
                <strong>Preview Mode:</strong> You are viewing a temporary
                preview of the admin dashboard. This is not authenticated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
                  {adminStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Families Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase tracking-wide">
                  Total Families
                </p>
                <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
                  {adminStats.totalFamilies.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Transactions Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase tracking-wide">
                  Total Transactions
                </p>
                <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
                  {adminStats.totalTransactions.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Budgets Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase tracking-wide">
                  Total Budgets
                </p>
                <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
                  {adminStats.totalBudgets.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-heading3 font-sansation font-bold text-text-1000 mb-6">
            Administration Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="block p-4 border border-text-300 rounded-lg hover:shadow-md hover:border-primary-500 transition-all duration-200"
            >
              <h3 className="font-nunitosans font-bold text-text-1000 mb-2">
                Manage Users
              </h3>
              <p className="text-text-600 font-nunitosans text-sm">
                View, edit, or delete user accounts
              </p>
            </Link>

            <Link
              href="/admin/families"
              className="block p-4 border border-text-300 rounded-lg hover:shadow-md hover:border-primary-500 transition-all duration-200"
            >
              <h3 className="font-nunitosans font-bold text-text-1000 mb-2">
                Manage Families
              </h3>
              <p className="text-text-600 font-nunitosans text-sm">
                View and manage family accounts
              </p>
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-heading3 font-sansation font-bold text-text-1000 mb-4">
              User Growth Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transactions Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-heading3 font-sansation font-bold text-text-1000 mb-4">
              Transaction Volume
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.transactionVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="transactions"
                  fill="#00C49F"
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-heading3 font-sansation font-bold text-text-1000 mb-4">
              Expense Category Distribution
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="lg:col-span-1">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        value ? `NPR ${value.toLocaleString()}` : "NPR 0"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-nunitosans font-bold text-text-1000 mb-4">
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  {chartData.categoryData.map((item, index) => {
                    const total = chartData.categoryData.reduce(
                      (sum, cat) => sum + cat.value,
                      0,
                    );
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-text-700 font-nunitosans text-sm font-medium">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-text-1000 font-nunitosans font-bold text-sm">
                            {percentage}%
                          </p>
                          <p className="text-text-600 font-nunitosans text-xs">
                            NPR {item.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={null}>
      <AdminDashboardContent />
    </Suspense>
  );
}
