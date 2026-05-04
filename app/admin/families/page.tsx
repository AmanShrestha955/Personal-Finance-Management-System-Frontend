"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminFamilies,
  updateFamily,
  deleteFamily,
  type Family,
} from "@/utils/adminApi";

export default function AdminFamiliesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", status: "" });

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
    queryKey: ["adminFamilies", page],
    queryFn: async () => {
      console.log("[Admin Families] Fetching families from backend...");
      const result = await getAdminFamilies(page, 10, "");
      console.log("[Admin Families] Response received:", result);
      return result;
    },
    enabled: shouldFetch,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { familyId: string; name?: string; status?: string }) =>
      updateFamily(data.familyId, { name: data.name, status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFamilies"] });
      setEditingFamilyId(null);
      alert("Family updated successfully!");
    },
    onError: (error) => {
      alert("Failed to update family");
      console.error("[Admin Families] Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFamilies"] });
      alert("Family deleted successfully!");
    },
    onError: (error) => {
      alert("Failed to delete family");
      console.error("[Admin Families] Delete error:", error);
    },
  });

  // Prepare data
  const families = previewMode
    ? [
        {
          _id: "1",
          name: "Smith Family",
          owner: { _id: "o1", name: "John Smith", email: "john@example.com" },
          members: [],
          createdAt: "2024-01-15",
          status: "active",
        },
        {
          _id: "2",
          name: "Johnson Family",
          owner: { _id: "o2", name: "Jane Johnson", email: "jane@example.com" },
          members: [],
          createdAt: "2024-02-20",
          status: "active",
        },
      ]
    : response?.data || [];

  const handleViewDetails = (family: Family) => {
    setSelectedFamily(family);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedFamily(null);
  };

  const handleEditFamily = (family: Family) => {
    console.log("[Admin Families] Edit family:", family._id);
    setEditingFamilyId(family._id);
    setEditFormData({ name: family.name, status: family.status });
  };

  const handleSaveEdit = (familyId: string) => {
    updateMutation.mutate({
      familyId,
      name: editFormData.name,
      status: editFormData.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingFamilyId(null);
    setEditFormData({ name: "", status: "" });
  };

  const handleDeleteFamily = (familyId: string, familyName: string) => {
    if (confirm(`Are you sure you want to delete ${familyName}?`)) {
      deleteMutation.mutate(familyId);
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
                Manage Families
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
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase">
              Total Families
            </p>
            <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
              {families.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase">
              Active Families
            </p>
            <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
              {families.filter((f) => f.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-text-600 font-nunitosans text-sm font-semibold uppercase">
              Total Members
            </p>
            <p className="text-heading2 font-sansation font-bold text-text-1000 mt-2">
              {families.reduce((sum, f) => sum + (f.members?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* Families Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {families.map((family) => (
                <tr
                  key={family._id}
                  className={
                    editingFamilyId === family._id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50 transition-colors"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-1000">
                      {editingFamilyId === family._id ? (
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
                        family.name
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-600">
                    {family.owner?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {family.members?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingFamilyId === family._id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          family.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {family.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-600">
                    {new Date(family.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    {editingFamilyId === family._id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(family._id)}
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
                          onClick={() => handleViewDetails(family)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditFamily(family)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFamily(family._id, family.name)
                          }
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

      {/* Details Modal */}
      {showDetails && selectedFamily && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-heading3 font-sansation font-bold text-text-1000">
                Family Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-text-600 font-nunitosans text-sm">
                  Family Name
                </p>
                <p className="font-nunitosans font-bold text-text-1000">
                  {selectedFamily.name}
                </p>
              </div>
              <div>
                <p className="text-text-600 font-nunitosans text-sm">Owner</p>
                <p className="font-nunitosans font-bold text-text-1000">
                  {selectedFamily.owner?.name}
                </p>
                <p className="text-text-600 font-nunitosans text-sm">
                  {selectedFamily.owner?.email}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-600 font-nunitosans text-sm">
                    Members
                  </p>
                  <p className="font-nunitosans font-bold text-text-1000">
                    {selectedFamily.members?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-text-600 font-nunitosans text-sm">
                    Status
                  </p>
                  <p
                    className={`font-nunitosans font-bold ${
                      selectedFamily.status === "active"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {selectedFamily.status}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-text-600 font-nunitosans text-sm">Created</p>
                <p className="font-nunitosans font-bold text-text-1000">
                  {new Date(selectedFamily.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-2 justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 border border-gray-300 rounded-md text-text-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseDetails();
                  handleEditFamily(selectedFamily);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
