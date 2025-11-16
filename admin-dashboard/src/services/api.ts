import axios from "axios";
// import { logout, setCredentials } from "../features/authSlice"; // <-- REMOVE THIS LINE

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

interface AuthState {
  accessToken: string | null;
}

interface RootState {
  auth: AuthState;
}

const apiRefresh = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const injectStore = (store: any) => {
  api.interceptors.request.use(
    (config) => {
      const state = store.getState() as RootState;
      const token = state.auth.accessToken;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Add a check to prevent looping on refresh calls themselves
      if (originalRequest.url === "/auth/refresh") {
        // If refresh itself fails, just clear credentials and reject
        store.dispatch({ type: "auth/clearCredentials" });
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await apiRefresh.post("/auth/refresh");

          // *** THE FIX ***
          // Dispatch by type instead of importing the action
          store.dispatch({
            type: "auth/setCredentials",
            payload: { accessToken: data.accessToken },
          });

          originalRequest.headers["Authorization"] =
            `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          // *** THE FIX ***
          // Dispatch by type instead of importing the action
          store.dispatch({ type: "auth/clearCredentials" });

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
