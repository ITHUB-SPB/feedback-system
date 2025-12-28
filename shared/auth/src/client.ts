import { createAuthClient } from "better-auth/react";
import {
    adminClient,
    customSessionClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";

import { type CreateAuth } from "./server";
import { ac, roles } from './permissionControl';

export const getAuthClient = (apiBaseUrl: string) => createAuthClient({
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
