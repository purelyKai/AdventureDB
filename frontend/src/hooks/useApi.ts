import API_BASE_URL from "../config/api";
import { useState, useCallback } from "react";

/**
 * Custom React hook for API operations
 * Provides a unified interface for CRUD operations against a specified API endpoint
 * Manages loading state and error handling automatically
 *
 * @param endpoint - The API endpoint to target (e.g., 'characters', 'items')
 * @returns Object containing CRUD operations and state variables
 */
export const useApi = (endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all data from the specified endpoint
   * Automatically handles loading states and error conditions
   *
   * @returns Promise resolving to the fetched data or empty array on error
   */
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

  /**
   * Creates a new item at the specified endpoint
   * Sets appropriate Content-Type headers for JSON data
   *
   * @param item - The item data to create
   * @returns Promise resolving to the created item or null on error
   */
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

  /**
   * Updates an existing item by ID
   * Uses PUT method to replace the entire resource
   *
   * @param id - The ID of the item to update
   * @param item - The updated item data
   * @returns Promise resolving to the updated item or null on error
   */
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

  /**
   * Deletes an item by ID
   * Performs error handling and manages loading state
   *
   * @param id - The ID of the item to delete
   * @returns Promise resolving to the server response or null on error
   */
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

  // Return all CRUD operations and state for component use
  return { fetchData, createItem, updateItem, deleteItem, isLoading, error };
};
