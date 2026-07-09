import axios from "axios";

// Central API base URL. Change here (or via VITE_API_URL) instead of in every file.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-resume-analyzer-1n57.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach the Clerk session token to every request.
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* not signed in yet — request goes out unauthenticated */
  }
  return config;
});

// If the session is invalid/expired, send the user to sign in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
