import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
import { ac, roles } from "./permissionControl"


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
      adminClient({
        ac,
        roles
      }),
    ]
  });
