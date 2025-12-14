import { createAPIClient } from "@shared/api/client";

export const apiClient = createAPIClient({
  apiPath: "/api",
  serverUrl: import.meta.env.VITE_API_BASE_URL!,
});
