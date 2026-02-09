import { popupError } from "./popup-alert.js"


// const BASE_URL = 'http://localhost:4500';
const BASE_URL = 'https://editable-portfolio-website-1.onrender.com';


const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await refreshApi.get("/auth/refreshToken");
        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        popupError("Session expired. Please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
