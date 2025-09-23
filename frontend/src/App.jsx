import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEditApplication from "./pages/AddEditApplication";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AuthCallback from "./pages/AuthCallback";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/add" element={<AddEditApplication />} />
                  <Route path="/edit/:id" element={<AddEditApplication />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
