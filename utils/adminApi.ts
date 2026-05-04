import { postData, getData, putData, deleteData } from "./request";

// Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFamilies: number;
  totalTransactions: number;
  totalBudgets: number;
}

export interface DashboardResponse {
  message: string;
  stats: AdminStats;
  userGrowthData: Array<{
    _id: { month: number; year: number };
    count: number;
  }>;
  recentTransactions: any[];
  transactionByCategory: any[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserResponse {
  message: string;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Family {
  _id: string;
  name: string;
  owner: { _id: string; name: string; email: string };
  members: any[];
  createdAt: string;
  status: string;
}

export interface FamilyResponse {
  message: string;
  data: Family[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Transaction {
  _id: string;
  userId: { name: string; email: string };
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

export interface TransactionResponse {
  message: string;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginResponse {
  token: string;
  message: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Admin Authentication
export const adminLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  console.log("[API] adminLogin called with email:", email);
  try {
    const response = await postData<
      { email: string; password: string },
      LoginResponse
    >("/auth/admin-login", {
      email,
      password,
    });
    console.log("[API] adminLogin success:", response);
    return response;
  } catch (error) {
    console.error("[API] adminLogin error:", error);
    throw error;
  }
};

// Dashboard Statistics
export const getAdminDashboardStats = async (): Promise<DashboardResponse> => {
  console.log("[API] getAdminDashboardStats called");
  try {
    const response = await getData<never, DashboardResponse>(
      "/auth/dashboard/stats",
    );
    console.log("[API] getAdminDashboardStats success:", response);
    return response;
  } catch (error) {
    console.error("[API] getAdminDashboardStats error:", error);
    throw error;
  }
};

// User Management
export const getAdminUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<UserResponse> => {
  console.log(
    "[API] getAdminUsers called with page:",
    page,
    "limit:",
    limit,
    "search:",
    search,
  );
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    const response = await getData<never, UserResponse>(
      `/auth/users?${params.toString()}`,
    );
    console.log(
      "[API] getAdminUsers success, received:",
      response.data.length,
      "users",
    );
    return response;
  } catch (error) {
    console.error("[API] getAdminUsers error:", error);
    throw error;
  }
};

export const getAdminUserDetails = async (
  userId: string,
): Promise<{ message: string; data: User }> => {
  console.log("[API] getAdminUserDetails called with userId:", userId);
  try {
    const response = await getData<never, { message: string; data: User }>(
      `/auth/users/${userId}`,
    );
    console.log("[API] getAdminUserDetails success:", response);
    return response;
  } catch (error) {
    console.error("[API] getAdminUserDetails error:", error);
    throw error;
  }
};

export const suspendUserAccount = async (
  userId: string,
  reason: string,
): Promise<{ message: string; data: User }> => {
  console.log(
    "[API] suspendUserAccount called with userId:",
    userId,
    "reason:",
    reason,
  );
  try {
    const response = await postData<
      { reason: string },
      { message: string; data: User }
    >(`/auth/users/${userId}/suspend`, { reason });
    console.log("[API] suspendUserAccount success:", response);
    return response;
  } catch (error) {
    console.error("[API] suspendUserAccount error:", error);
    throw error;
  }
};

export const unsuspendUserAccount = async (
  userId: string,
): Promise<{ message: string; data: User }> => {
  console.log("[API] unsuspendUserAccount called with userId:", userId);
  try {
    const response = await postData<{}, { message: string; data: User }>(
      `/auth/users/${userId}/unsuspend`,
      {},
    );
    console.log("[API] unsuspendUserAccount success:", response);
    return response;
  } catch (error) {
    console.error("[API] unsuspendUserAccount error:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string },
): Promise<{ message: string; data: User }> => {
  console.log("[API] updateUser called with userId:", userId, "data:", data);
  try {
    const response = await putData<
      { name?: string; email?: string },
      { message: string; data: User }
    >(`/auth/users/${userId}`, data);
    console.log("[API] updateUser success:", response);
    return response;
  } catch (error) {
    console.error("[API] updateUser error:", error);
    throw error;
  }
};

export const deleteUser = async (
  userId: string,
): Promise<{ message: string; data: User }> => {
  console.log("[API] deleteUser called with userId:", userId);
  try {
    const response = await deleteData<{ message: string; data: User }>(
      `/auth/users/${userId}`,
    );
    console.log("[API] deleteUser success:", response);
    return response;
  } catch (error) {
    console.error("[API] deleteUser error:", error);
    throw error;
  }
};

// Transaction Management
export const getAdminTransactions = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    userId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<TransactionResponse> => {
  console.log(
    "[API] getAdminTransactions called with page:",
    page,
    "filters:",
    filters,
  );
  try {
    let query = `page=${page}&limit=${limit}`;
    if (filters) {
      if (filters.userId) query += `&userId=${filters.userId}`;
      if (filters.type) query += `&type=${filters.type}`;
      if (filters.startDate) query += `&startDate=${filters.startDate}`;
      if (filters.endDate) query += `&endDate=${filters.endDate}`;
    }
    const response = await getData<never, TransactionResponse>(
      `/auth/transactions?${query}`,
    );
    console.log(
      "[API] getAdminTransactions success, received:",
      response.data.length,
      "transactions",
    );
    return response;
  } catch (error) {
    console.error("[API] getAdminTransactions error:", error);
    throw error;
  }
};

// Family Management
export const getAdminFamilies = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<FamilyResponse> => {
  console.log(
    "[API] getAdminFamilies called with page:",
    page,
    "search:",
    search,
  );
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    const response = await getData<never, FamilyResponse>(
      `/auth/families?${params.toString()}`,
    );
    console.log(
      "[API] getAdminFamilies success, received:",
      response.data.length,
      "families",
    );
    return response;
  } catch (error) {
    console.error("[API] getAdminFamilies error:", error);
    throw error;
  }
};

export const updateFamily = async (
  familyId: string,
  data: { name?: string; status?: string },
): Promise<{ message: string; data: Family }> => {
  console.log(
    "[API] updateFamily called with familyId:",
    familyId,
    "data:",
    data,
  );
  try {
    const response = await putData<
      { name?: string; status?: string },
      { message: string; data: Family }
    >(`/auth/families/${familyId}`, data);
    console.log("[API] updateFamily success:", response);
    return response;
  } catch (error) {
    console.error("[API] updateFamily error:", error);
    throw error;
  }
};

export const deleteFamily = async (
  familyId: string,
): Promise<{ message: string; data: Family }> => {
  console.log("[API] deleteFamily called with familyId:", familyId);
  try {
    const response = await deleteData<{ message: string; data: Family }>(
      `/auth/families/${familyId}`,
    );
    console.log("[API] deleteFamily success:", response);
    return response;
  } catch (error) {
    console.error("[API] deleteFamily error:", error);
    throw error;
  }
};

export default {
  adminLogin,
  getAdminDashboardStats,
  getAdminUsers,
  getAdminUserDetails,
  suspendUserAccount,
  unsuspendUserAccount,
  updateUser,
  deleteUser,
  getAdminTransactions,
  getAdminFamilies,
  updateFamily,
  deleteFamily,
};
