import axios from "axios";

const apiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === "Token expired" &&
      !originalRequest._retry // to avoid infinite loop
    ) {
      originalRequest._retry = true;
      try {
        await apiInstance.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`)
        console.log("intercepter reached");

        return apiInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        window.location.href = "/sign-in";
      }
    } else if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === "Session expired. You logged in from another device."
    ) {
      // Immediately redirect user to login since they logged in elsewhere
      window.location.href = "/sign-in";
    }
    return Promise.reject(error)
  },
);

export default apiInstance;
