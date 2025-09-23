import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, CheckCircle } from "lucide-react";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token);
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      // No token found, redirect to login
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirecting you to the dashboard...
          </p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Processing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
