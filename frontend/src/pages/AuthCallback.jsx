import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      const backendCallback = `${API_BASE_URL}/auth/github/callback?code=${encodeURIComponent(
        code
      )}${state ? `&state=${encodeURIComponent(state)}` : ""}`;
      window.location.replace(backendCallback);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Subtle theme-colored background accents */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary-700/10 blur-3xl" />
      </div>

      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
