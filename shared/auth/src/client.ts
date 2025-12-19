import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import {
  adminClient,
  customSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { ac, roles } from "./permissionControl";
import { createAuth } from "./server";

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
        roles,
      }),
      customSessionClient<ReturnType<typeof createAuth>>(),
      inferAdditionalFields<ReturnType<typeof createAuth>>(),
    ],
  });