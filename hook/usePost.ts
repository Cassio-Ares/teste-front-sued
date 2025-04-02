import { useState } from "react";
import { informationError } from "../components/informationError";
import { api } from "../connect/api";

export const usePost = <T>(endpoint: string, refetchFn?: () => void) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body: T) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<T>(endpoint, body);

      setData(response.data);

      if (refetchFn) {
        refetchFn();
      }

      return response.data;
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, postData };
};

/**
 * import { api } from "../connect/api";
import { useEffect, useState } from "react";
import { informationError } from "../components/informationError";

export const usePost = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body: T) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<T>(`${endpoint}`, body);
      setData(response.data || response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

 */
