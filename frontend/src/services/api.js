import axios from "axios";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://job-tracker-c78l.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const applicationsAPI = {
  // Get all applications
  getAll: async () => {
    const response = await api.get("/applications/");
    return response.data;
  },

  // Get single application
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Create new application
  create: async (formData) => {
    const response = await api.post("/applications/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update application
  update: async (id, formData) => {
    const response = await api.put(`/applications/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete application
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Get photo URL (now returns Cloudinary URL directly)
  getPhotoUrl: (photoUrl) => {
    return photoUrl; // Cloudinary URL is already complete
  },
};

export const authAPI = {
  // Get GitHub auth URL
  getGitHubAuthUrl: async () => {
    const response = await api.get("/auth/github");
    return response.data.auth_url;
  },

  // Get current user
  getCurrentUser: async (token) => {
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

export default api;
