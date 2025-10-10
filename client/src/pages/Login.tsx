import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Shield, Lock, User, AlertTriangle } from "lucide-react";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, register, error, loading, isAuthenticated, clearError } =
    useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPrivacyTip, setShowPrivacyTip] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when toggling between login and register
  useEffect(() => {
    clearError();
    setFormError(null);
  }, [isLogin, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate form
    if (!formData.username || !formData.password) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (isLogin)
      await login({
        username: formData.username,
        password: formData.password,
      });
    else
      await register({
        username: formData.username,
        password: formData.password,
        isAnonymous: true,
      });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowPrivacyTip(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className={`w-full max-w-md  p-8 shadow-xl bg-white text-gray-800`}>
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-purple-500 p-3 "></div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold">
          {isLogin ? "Welcome To Pamoja" : "Create Account at Pamoja"}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLogin
            ? "Sign in to continue to Pamoja"
            : "Join our community anonymously"}
        </p>

        {(error || formError) && (
          <div className="mb-4 flex items-start  bg-red-1-0 p-3 text-sm text-red-700 bg-red-900/30">
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
            <span>{error || formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={
                  isLogin
                    ? "Enter your username"
                    : "Choose an anonymous username"
                }
                className={`w-full  border pl-10 pr-3 py-2
                    border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500`}
                required
              />
            </div>
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use an anonymous username not related to your real name
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full  border pl-10 pr-3 py-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500`}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full  border pl-10 pr-3 py-2
                      border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                   focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500`}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full  py-2.5 font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pamoja-purple border border-pamoja-purple hover:bg-transparent hover:text-pamoja-purple"
            }`}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="ml-1 text-sm font-medium text-pink-500 hover:text-pink-600"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        {!isLogin && !showPrivacyTip && (
          <div className="mt-6 bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium ">Privacy Notice</h3>
                <div className="mt-2 text-sm ">
                  <p>
                    For your privacy and security, please use an anonymous
                    username that doesn't reveal your real identity. We
                    recommend not sharing personal information in your username
                    or conversations.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPrivacyTip(true)}
                    className="text-sm font-medium bg-pamoja-purple px-4 py-1 text-white"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
