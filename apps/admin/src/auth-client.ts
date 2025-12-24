import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  customSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

import { ac, roles, type CreateAuth } from "@shared/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL!;

export const authClient = createAuthClient({
  baseURL: `${apiBaseUrl}/api/auth`,
  plugins: [
    adminClient({
      ac,
      roles,
    }),
    customSessionClient<ReturnType<CreateAuth>>(),
    inferAdditionalFields<ReturnType<CreateAuth>>(),
  ],
});
