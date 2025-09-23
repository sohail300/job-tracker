import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      const backendCallback = `http://localhost:8000/api/auth/github/callback?code=${encodeURIComponent(
        code
      )}${state ? `&state=${encodeURIComponent(state)}` : ""}`;
      window.location.replace(backendCallback);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return null;
};

export default AuthCallback;
