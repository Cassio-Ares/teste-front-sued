import { api } from "../connect/api";
import { useEffect, useState } from "react";
import { informationError } from "../components/informationError";

export const useGetById = <T>(endpoint: string) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(`${endpoint}/${id}`);
      setData(response.data || response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }

    return { data, loading, error, fetchData };
  };
};
