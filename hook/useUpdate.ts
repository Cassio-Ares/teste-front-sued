import { useState } from "react";
import { informationError } from "../components/informationError";
import { api } from "../connect/api";

export const useUpdate = <T>(endpoint: string, refetchFn?: () => void) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upDate = async (id: string | number, body: T) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`${endpoint}/${id}`, body);

      setData(response.data);
      // setData(response.data || response.data.data);

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

  return { data, loading, error, upDate };
};
