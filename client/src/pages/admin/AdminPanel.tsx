import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useAdminStore } from "../../store/admin.store";
import { useLearningMaterialStore } from "../../store/learningMaterial.store";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import LearningMaterialForm from "./LearningMaterialForm";
import AnalyticsDashboard from "../../components/admin/AnalyticsDashboard";

const AdminPanel = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    users,
    stats,
    loading: adminLoading,
    error: adminError,
    fetchStats,
    fetchUsers,
    updateUserRole,
  } = useAdminStore();

  const {
    materials,
    loading: materialsLoading,
    error: materialsError,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  } = useLearningMaterialStore();

  useEffect(() => {
    if (user?.role !== "ADMIN") return navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchMaterials();
  }, []);

  const handleCreateMaterial = async (data: any) => {
    try {
      await createMaterial(data);
      setShowMaterialForm(false);
    } catch (err) {}
  };

  const handleUpdateMaterial = async (data: any) => {
    if (!editingMaterial) return;
    try {
      await updateMaterial(editingMaterial._id, data);
      setEditingMaterial(null);
    } catch (err) {}
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    try {
      await deleteMaterial(id);
    } catch (err) {}
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users" },
    {
      id: "learning",
      label: "Learning Materials",
    },
    {
      id: "reports",
      label: "Reports",
    },
    {
      id: "suggestions",
      label: "Suggestions",
    },
  ];

  if (adminLoading || materialsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (showMaterialForm || editingMaterial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white  shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingMaterial
                ? "Edit Learning Material"
                : "Create Learning Material"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowMaterialForm(false);
                setEditingMaterial(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <LearningMaterialForm
            onSubmit={
              editingMaterial ? handleUpdateMaterial : handleCreateMaterial
            }
            initialData={editingMaterial || undefined}
            onCancel={() => {
              setShowMaterialForm(false);
              setEditingMaterial(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pamoja Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Pamoja Site adminisration panel</p>
        </div>

        {(adminError || materialsError) && (
          <div className="bg-red-50 text-red-500 p-4  mb-6">
            {adminError || materialsError}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors uppercase ${
                activeTab === tab.id
                  ? "text-pamoja-purple border-b-2 border-pamoja-purple"
                  : "text-gray-500 hover:text-pamoja-purple"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold">
                    {stats?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Community Messages</span>
                  <span className="font-semibold">
                    {stats?.totalMessages || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Learning Materials</span>
                  <span className="font-semibold">
                    {stats?.totalMaterials || 0}
                  </span>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Community Questions</span>
                    <span className="font-semibold">
                      {stats?.totalQuestions || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">User Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registered Users</span>
                    <span className="font-semibold">
                      {stats?.registeredUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Anonymous Users</span>
                    <span className="font-semibold">
                      {stats?.anonymousUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Conversations</span>
                    <span className="font-semibold">
                      {stats?.totalConversations || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">WhatsApp Chats</span>
                    <span className="font-semibold">
                      {stats?.whatsappConversations || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Content Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suggestions</span>
                    <span className="font-semibold">
                      {stats?.totalSuggestions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Testimonials</span>
                    <span className="font-semibold">
                      {stats?.totalTestimonials || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("users")}
                    className="w-full"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button
                    onClick={() => setActiveTab("learning")}
                    className="w-full"
                    variant="outline"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learning Materials
                  </Button>
                  <Button
                    onClick={() => setActiveTab("reports")}
                    className="w-full"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Reports
                  </Button>
              </div>
            </div>
            </div>

            {/* Analytics Dashboard - Embedded directly in Overview */}
            <AnalyticsDashboard />
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white  shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">User Management</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 font-medium text-gray-600">
                        Username
                      </th>
                      <th className="pb-3 font-medium text-gray-600">Role</th>
                      <th className="pb-3 font-medium text-gray-600">Joined</th>
                      <th className="pb-3 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(
                        (u) =>
                          !searchQuery ||
                          (u.username?.toLowerCase() || "").includes(
                            searchQuery.toLowerCase()
                          )
                      )
                      .map((user) => (
                        <tr key={user._id} className="border-b border-gray-100">
                          <td className="py-4">{user.username}</td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateUserRole(
                                  user._id,
                                  user.role === "ADMIN" ? "USER" : "ADMIN"
                                )
                              }
                            >
                              Make {user.role === "ADMIN" ? "User" : "Admin"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Learning Materials</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  <Button onClick={() => setShowMaterialForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 font-medium text-gray-600">Title</th>
                      <th className="pb-3 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="pb-3 font-medium text-gray-600">Status</th>
                      <th className="pb-3 font-medium text-gray-600">
                        Featured
                      </th>
                      <th className="pb-3 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials
                      .filter(
                        (m) =>
                          m.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          m.description
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((material) => (
                        <tr
                          key={material._id}
                          className="border-b border-gray-100"
                        >
                          <td className="py-4">
                            <div>
                              <div className="font-medium">
                                {material.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {material.description.substring(0, 100)}...
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-gray-100 text-sm">
                              {material.category}
                            </span>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-1 text-sm ${
                                material.status === "PUBLISHED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {material.status}
                            </span>
                          </td>
                          <td className="py-4">
                            {material.featured ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm">
                                Featured
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMaterial(material)}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteMaterial(material._id)
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Reports & Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-100">
                  <h4 className="font-semibold mb-4">User Activity Report</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive analysis of user engagement and activity
                    patterns.
                  </p>
                  <Button variant="outline" className="w-full">
                    Generate Report
                  </Button>
                </div>
                <div className="p-6 border border-gray-100">
                  <h4 className="font-semibold mb-4">Content Performance</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Track learning materials and community content performance.
                  </p>
                  <Button variant="outline" className="w-full">
                    Generate Report
                  </Button>
                </div>
                <div className="p-6 border border-gray-100">
                  <h4 className="font-semibold mb-4">Conversation Analytics</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Detailed insights into chat and conversation patterns.
                  </p>
                  <Button variant="outline" className="w-full">
                    Generate Report
                  </Button>
                </div>
                <div className="p-6 border border-gray-100">
                  <h4 className="font-semibold mb-4">Export Data</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Export all analytics data for external analysis.
                  </p>
                  <Button variant="outline" className="w-full">
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">User Suggestions</h3>
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No suggestions available at the moment.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  User suggestions will appear here when submitted.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
