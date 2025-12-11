import { createAPIClient } from "@shared/api/client";

export const apiClient = createAPIClient({
  apiPath: "/api",
  serverUrl: "http://localhost:3001",
});
