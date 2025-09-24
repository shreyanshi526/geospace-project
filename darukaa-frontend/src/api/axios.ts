import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // update baseURL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → extract data / handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// --- Generic API Methods --- //
const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get<T>(url, config).then((res) => res.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => api.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => api.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => api.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete<T>(url, config).then((res) => res.data),
};

export default http;
