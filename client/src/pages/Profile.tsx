import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-14">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-pamoja-purple p-8 text-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <User size={48} className="text-white/80" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-pamoja-purple hover:bg-pamoja-purple/5 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600">
                    <User size={18} />
                    <span>Username</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                      {formData.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    <span>Email</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pamoja-purple focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                      {formData.email}
                    </p>
                  )}
                </div>

                {/* Join Date Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>Join Date</span>
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {new Date(user?.createdAt || "").toLocaleDateString()}
                  </p>
                </div>

                {/* Account Type Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600">
                    <Shield size={18} />
                    <span>Account Type</span>
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.isAnonymous ? "Anonymous" : "Registered"}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-pamoja-purple text-white rounded-lg hover:bg-pamoja-purple/90 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
