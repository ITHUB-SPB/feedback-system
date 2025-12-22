import { createAuthClient } from "@shared/auth";

export const authClient = createAuthClient({
  apiBasePath: "/api",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL!,
});
