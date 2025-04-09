import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/router";

export function createApiInstance() {
  const api: AxiosInstance = axios.create({
    //  baseURL: "http://localhost:3001",
    baseURL: "https://sued-technical-sheet-back.onrender.com",
    headers: {
      "Content-Type": "application/json",
    },
  });

  function getToken(): string | null {
    return localStorage.getItem("token");
  }

  function setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  function removeToken(): void {
    localStorage.removeItem("token");
  }

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        removeToken();
        const router = useRouter();
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );

  return { api, getToken, setToken, removeToken };
}

export const { api, getToken, setToken, removeToken } = createApiInstance();

// export const api: AxiosInstance = axios.create({
//    baseURL: "http://localhost:3001",
//    headers: {
//      "Content-Type": "application/json",
//    },
//  });
