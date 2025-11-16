import axios from "axios";
import {store} from "../app/store";
import { logout, setCredentials } from "../features/authSlice";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8080";

interface AuthState {
  accessToken: string | null;
}

interface RootState {
  auth: AuthState;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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
    const dispatch = store.dispatch;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");

        dispatch(setCredentials({ accessToken: data.accessToken }));

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        dispatch(logout());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
