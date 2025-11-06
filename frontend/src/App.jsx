import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme, App as AntdApp } from "antd";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import AddEditApplication from "./pages/AddEditApplication";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AuthCallback from "./pages/AuthCallback";
import Layout from "./components/Layout";
import Templates from "./pages/Templates";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

function LandingGuard() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/applications" replace />;
  }
  return <Landing />;
}

function App() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Initialize on mount
    setIsDark(root.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        }}
      >
        <AntdApp>
        <Routes>
          <Route path="/" element={<LandingGuard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route
            path="/applications/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="" element={<Home />} />
                    <Route path="add" element={<AddEditApplication />} />
                    <Route path="edit/:id" element={<AddEditApplication />} />
                    <Route path="templates" element={<Templates />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        </AntdApp>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
