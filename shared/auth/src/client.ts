import { admin } from "better-auth/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";

export interface AuthClientOptions {
  apiBaseUrl: string;
  apiBasePath: string;
}

export const createAuthClient = ({
  apiBaseUrl,
  apiBasePath,
}: AuthClientOptions) =>
  createBetterAuthClient({
    baseURL: `${apiBaseUrl}${apiBasePath}/auth`,
    plugins: [
      admin(),
    ]
  });
