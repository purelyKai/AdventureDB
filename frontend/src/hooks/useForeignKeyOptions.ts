import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useForeignKeyOptions = (
  endpoint: string,
  selectTarget: string
) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const { fetchData } = useApi(endpoint);

  useEffect(() => {
    const loadOptions = async () => {
      const data = await fetchData();
      const formattedOptions = data.map((item: any) => ({
        value: item.id.toString(),
        label: item[selectTarget],
      }));
      setOptions(formattedOptions);
    };

    loadOptions();
  }, [fetchData, selectTarget]);

  return options;
};
