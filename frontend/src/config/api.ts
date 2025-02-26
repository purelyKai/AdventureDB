// Configuration options
interface ApiConfig {
  LOCAL_API_URL: string;
  PRODUCTION_API_URL: string;
  USE_LOCAL_API: boolean;
}

const config: ApiConfig = {
  LOCAL_API_URL:
    import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3001/api/",
  PRODUCTION_API_URL: import.meta.env.VITE_PRODUCTION_API_URL || "",
  USE_LOCAL_API: import.meta.env.VITE_USE_LOCAL_API === "true",
};

const API_BASE_URL = config.USE_LOCAL_API
  ? config.LOCAL_API_URL
  : config.PRODUCTION_API_URL;

export default API_BASE_URL;
