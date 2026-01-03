import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createAPIClient } from "@shared/api/client";

const client = createAPIClient({
  serverUrl: import.meta.env.VITE_API_BASE_URL!,
  apiPath: "/api",
});

export const orpcClient = createTanstackQueryUtils(client);
