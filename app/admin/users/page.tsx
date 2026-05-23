"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  updateUser,
  deleteUser,
  type User,
} from "@/utils/adminApi";

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });

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
    queryKey: ["adminUsers", page],
    queryFn: async () => {
      console.log("[Admin Users] Fetching users from backend...");
      const result = await getAdminUsers(page, 10, "");
      console.log("[Admin Users] Response received:", result);
      return result;
    },
    enabled: shouldFetch,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { userId: string; name?: string; email?: string }) =>
      updateUser(data.userId, { name: data.name, email: data.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setEditingUserId(null);
      alert("User updated successfully!");
    },
    onError: (error) => {
      alert("Failed to update user");
      console.error("[Admin Users] Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      alert("User deleted successfully!");
    },
    onError: (error) => {
      alert("Failed to delete user");
      console.error("[Admin Users] Delete error:", error);
    },
  });

  // Prepare data
  const users = previewMode
    ? [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          status: "active",
          createdAt: "2024-01-15",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          status: "active",
          createdAt: "2024-02-20",
        },
        {
          _id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          status: "inactive",
          createdAt: "2024-03-10",
        },
      ]
    : response?.data || [];

  const handleEditUser = (user: User) => {
    console.log("[Admin Users] Edit user:", user._id);
    setEditingUserId(user._id);
    setEditFormData({ name: user.name, email: user.email });
  };

  const handleSaveEdit = (userId: string) => {
    updateMutation.mutate({
      userId,
      name: editFormData.name,
      email: editFormData.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({ name: "", email: "" });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteMutation.mutate(userId);
    }
  };

  if (!isAuthenticated || (isLoading && !previewMode)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-primary-500 hover:text-primary-600 font-nunitosans font-bold"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-heading3 font-sansation font-bold text-text-1000">
                Manage Users
              </h1>
            </div>
            {previewMode && (
              <div className="bg-yellow-50 px-3 py-1 rounded text-yellow-800 text-sm font-nunitosans">
                Preview Mode
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={editingUserId === user._id ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-1000">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-600">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(user._id)}
                          disabled={updateMutation.isPending}
                          className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={null}>
      <AdminUsersContent />
    </Suspense>
  );
}
