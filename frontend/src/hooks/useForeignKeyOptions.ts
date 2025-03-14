import { useState, useEffect } from "react";
import { useApi } from "./useApi";

/**
 * Custom hook for fetching and formatting foreign key options for select inputs
 * This hook automatically converts database records into a format suitable for dropdown components
 *
 * @param endpoint - The API endpoint to fetch options from (e.g., 'classes', 'characters')
 * @param selectTarget - The field name to use as the display label in options
 * @returns Array of formatted options with value/label pairs for select components
 */
export const useForeignKeyOptions = (
  endpoint: string,
  selectTarget: string
) => {
  // State to store formatted options for select components
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  // Use the API hook to fetch data from the specified endpoint
  const { fetchData } = useApi(endpoint);

  useEffect(() => {
    /**
     * Loads and formats options from the API endpoint
     * Handles edge cases like empty responses and missing target fields
     */
    const loadOptions = async () => {
      try {
        const data = await fetchData();

        // Validate the response data
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn(
            `No data received from ${endpoint} for foreign key options`
          );
          return;
        }

        // Get first item to determine id field
        const firstItem = data[0];

        // Find the ID field (ends with _id) that corresponds to the current endpoint
        // This uses a naming convention to intelligently locate the primary key
        const idFieldName = Object.keys(firstItem).find(
          (key) =>
            key.endsWith("_id") &&
            key.includes(endpoint.toLowerCase().replace(/_/g, "").slice(0, -1))
        );

        // Map the raw data to formatted options with value/label pairs
        const formattedOptions = data.map((item: any) => {
          // Get correct ID field or fallback to first column if no matching ID field found
          const idField = idFieldName || Object.keys(firstItem)[0];

          // Get label field - use selectTarget if available, otherwise fallback to a generated label
          const labelValue =
            item[selectTarget] !== undefined
              ? item[selectTarget]
              : `${endpoint} ${item[idField]}`;

          return {
            value: String(item[idField]), // Ensure value is string for consistent handling
            label: String(labelValue), // Ensure label is string
          };
        });

        setOptions(formattedOptions);
        console.log(
          `Loaded ${formattedOptions.length} options for ${endpoint}:`,
          formattedOptions
        );
      } catch (error) {
        console.error(`Error loading options for ${endpoint}:`, error);
        setOptions([]);
      }
    };

    // Fetch options when component mounts or dependencies change
    loadOptions();
  }, [fetchData, endpoint, selectTarget]);

  // Return the formatted options for use in select components
  return options;
};
