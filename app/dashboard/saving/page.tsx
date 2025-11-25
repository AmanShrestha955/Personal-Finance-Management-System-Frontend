"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Building2,
  Users,
  Wallet,
  PieChart,
  Bell,
  BarChart3,
  LogOut,
  Plus,
  TrendingUp,
  Target,
  Clock,
  ChevronDown,
  Filter,
  Search,
  MoreVertical,
  Download,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: string;
  saved: number;
  target: number;
  deadline: string;
  status: "completed" | "in-progress" | "overdue";
  description?: string;
  lastUpdated: string;
}

interface Stats {
  totalSaved: number;
  totalSavedChange: number;
  totalSavedPercentage: number;
  totalGoals: number;
  completedGoals: number;
  remainingBalance: number;
  remainingBalanceChange: number;
  remainingBalancePercentage: number;
}

const SavingGoalsResponsive = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "progress" | "completed">(
    "all"
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"deadline" | "progress" | "amount">(
    "deadline"
  );
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      category: "Safety",
      saved: 150000,
      target: 200000,
      deadline: "2024-12-31",
      status: "in-progress",
      description: "Building a 6-month emergency fund",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "New Car",
      category: "Transport",
      saved: 180000,
      target: 180000,
      deadline: "2024-06-30",
      status: "completed",
      description: "Saving for a new electric vehicle",
      lastUpdated: "2024-01-10",
    },
    {
      id: "3",
      title: "House Down Payment",
      category: "Property",
      saved: 320000,
      target: 500000,
      deadline: "2025-03-31",
      status: "in-progress",
      description: "20% down payment for dream home",
      lastUpdated: "2024-01-18",
    },
    {
      id: "4",
      title: "Vacation Fund",
      category: "Leisure",
      saved: 45000,
      target: 80000,
      deadline: "2024-07-15",
      status: "in-progress",
      description: "Family trip to Europe",
      lastUpdated: "2024-01-12",
    },
    {
      id: "5",
      title: "Education Fund",
      category: "Education",
      saved: 200000,
      target: 200000,
      deadline: "2023-12-31",
      status: "completed",
      description: "Masters degree tuition",
      lastUpdated: "2023-12-28",
    },
    {
      id: "6",
      title: "Investment Portfolio",
      category: "Investment",
      saved: 75000,
      target: 150000,
      deadline: "2024-09-30",
      status: "in-progress",
      description: "Building investment portfolio",
      lastUpdated: "2024-01-20",
    },
  ]);

  const stats: Stats = {
    totalSaved: 970000,
    totalSavedChange: 45000,
    totalSavedPercentage: 4.9,
    totalGoals: 6,
    completedGoals: 2,
    remainingBalance: 340000,
    remainingBalanceChange: 15000,
    remainingBalancePercentage: 4.6,
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  const calculateProgress = (saved: number, target: number) => {
    return Math.min((saved / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600 bg-emerald-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "overdue":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "in-progress":
        return "bg-blue-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const filteredGoals = goals
    .filter((goal) => {
      if (activeTab === "completed") return goal.status === "completed";
      if (activeTab === "progress") return goal.status === "in-progress";
      return true;
    })
    .filter(
      (goal) =>
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "deadline")
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === "progress")
        return (
          calculateProgress(b.saved, b.target) -
          calculateProgress(a.saved, a.target)
        );
      if (sortBy === "amount") return b.target - a.target;
      return 0;
    });

  const navItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: Building2, label: "Accounts", active: false },
    { icon: Users, label: "Beneficiaries", active: false },
    { icon: Wallet, label: "Savings", active: true },
    { icon: PieChart, label: "Investments", active: false },
    { icon: Bell, label: "Notifications", active: false, badge: 3 },
    { icon: BarChart3, label: "Analytics", active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="font-bold text-lg bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            FinanceHub
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isMobile ? "w-72" : "lg:w-64 xl:w-72"}
        bg-white border-r border-gray-200 shadow-xl lg:shadow-none
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">FinanceHub</h1>
                <p className="text-xs text-gray-500">Smart Savings</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                AK
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Amresh Kumar</p>
                <p className="text-xs text-gray-600">Premium Member</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      item.active
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
        transition-all duration-300
        ${isSidebarOpen && !isMobile ? "lg:ml-64 xl:ml-72" : ""}
        ${isMobile ? "pt-16" : ""}
      `}
      >
        <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Saving Goals
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage your financial goals
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus size={20} />
                Add New Goal
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <span className="flex items-center text-sm font-semibold text-emerald-600">
                  <ArrowUp size={14} className="mr-1" />
                  {stats.totalSavedPercentage}%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalSaved)}
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                +{formatCurrency(stats.totalSavedChange)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalGoals}
              </p>
              <p className="text-sm text-gray-500 mt-2">Active targets</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedGoals}
              </p>
              <p className="text-sm text-gray-500 mt-2">Goals achieved</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-orange-600" />
                </div>
                <span className="flex items-center text-sm font-semibold text-emerald-600">
                  <ArrowUp size={14} className="mr-1" />
                  {stats.remainingBalancePercentage}%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Remaining Target</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.remainingBalance)}
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                +{formatCurrency(stats.remainingBalanceChange)}
              </p>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Saving Goals
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="deadline">Sort by Deadline</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="amount">Sort by Amount</option>
                  </select>

                  {/* Filter Button */}
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Filter size={18} />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mt-6 border-b border-gray-100 -mb-6 overflow-x-auto">
                {(["all", "progress", "completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      pb-4 px-1 text-sm font-semibold transition-all relative whitespace-nowrap
                      ${
                        activeTab === tab
                          ? "text-teal-600"
                          : "text-gray-500 hover:text-gray-700"
                      }
                    `}
                  >
                    {tab === "all" && "All Goals"}
                    {tab === "progress" && "In Progress"}
                    {tab === "completed" && "Completed"}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals List */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {filteredGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No goals found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or add a new goal
                  </p>
                </div>
              ) : (
                filteredGoals.map((goal) => {
                  const progress = calculateProgress(goal.saved, goal.target);
                  return (
                    <div
                      key={goal.id}
                      className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-teal-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg text-gray-900">
                                  {goal.title}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                    goal.status
                                  )}`}
                                >
                                  {goal.status.replace("-", " ")}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {goal.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="text-gray-500">
                                  Category:{" "}
                                  <span className="font-medium text-gray-700">
                                    {goal.category}
                                  </span>
                                </span>
                                <span className="text-gray-500">
                                  Deadline:{" "}
                                  <span className="font-medium text-gray-700">
                                    {new Date(goal.deadline).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={18} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Saved:{" "}
                              <span className="font-bold text-gray-900">
                                {formatCurrency(goal.saved)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Target:{" "}
                              <span className="font-bold text-gray-900">
                                {formatCurrency(goal.target)}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {progress.toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">Complete</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                                goal.status
                              )}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <p className="text-xs text-gray-500">
                            Remaining:{" "}
                            <span className="font-semibold text-gray-700">
                              {formatCurrency(
                                Math.max(goal.target - goal.saved, 0)
                              )}
                            </span>
                          </p>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                              Withdraw
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg hover:shadow-md transition-all">
                              Add Amount
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Goal Modal (placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Goal</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600">Goal creation form would go here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingGoalsResponsive;
