import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Github, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    // Check for auth callback
    const token = searchParams.get("token");
    if (token) {
      handleAuthCallback(token);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleAuthCallback = async (token) => {
    try {
      setLoading(true);
      login(token);
      navigate("/");
    } catch (error) {
      console.error("Auth callback error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const authUrl = await authAPI.getGitHubAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("Failed to initiate GitHub login. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Job Application Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to track your job applications
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <button
              onClick={handleGitHubLogin}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Github className="h-5 w-5 text-gray-300 group-hover:text-gray-200" />
              </span>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continue with GitHub"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
