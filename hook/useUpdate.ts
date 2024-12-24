import { api } from "../connect/api";
import { useEffect, useState } from "react";
import { informationError } from "../components/informationError";

export const useUpdata = <T>(endpoint: string, refetchFn?: () => void) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updataData = async (id: string | number, body: T[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`${endpoint}/${id}`, body);
      setData(response.data || response.data.data);

      if (refetchFn) {
        refetchFn();
      }
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, updataData };
};
