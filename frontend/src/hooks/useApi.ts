import API_BASE_URL from "../config/api";
import { useState, useCallback } from "react";

export const useApi = (endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsLoading(false);
      return [];
    }
  }, [endpoint]);

  const createItem = useCallback(
    async (item: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
        return null;
      }
    },
    [endpoint]
  );

  const updateItem = useCallback(
    async (id: number, item: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
        return null;
      }
    },
    [endpoint]
  );

  const deleteItem = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
        return null;
      }
    },
    [endpoint]
  );

  return { fetchData, createItem, updateItem, deleteItem, isLoading, error };
};
