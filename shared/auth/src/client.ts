import { role } from "better-auth/plugins";
import { ac, superAdmin, moderator, official, citizen} from "./permissionControl"
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
      roles: [
        superAdmin,
        moderator,
        official,
        citizen
      ],
      // добавить роли
  });
