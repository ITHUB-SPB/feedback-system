import { type BetterAuthOptions, betterAuth } from "better-auth";
import { admin as adminPlugin, openAPI } from "better-auth/plugins"
import { ac, roles } from "./permissionControl"

import { db } from "@shared/database";

export interface AuthOptions {
  trustedOrigins: string[];
  serverUrl: string;
  apiPath: `/${string}`;
  authSecret: string;
  db: typeof db;
}

export type AuthInstance = ReturnType<typeof createAuth>;

export const getBaseOptions = (databaseInstance: typeof db) =>
  ({
    database: { db: databaseInstance },
    plugins: [
      openAPI({ disableDefaultReference: true }),
      adminPlugin({
        ac,
        roles
      }),
    ],
  }) satisfies BetterAuthOptions;

export const createAuth = ({
  trustedOrigins,
  serverUrl,
  apiPath,
  db,
  authSecret,
}: AuthOptions) => {
  return betterAuth({
    ...getBaseOptions(db),
    baseURL: `${serverUrl}${apiPath}/auth`,
    secret: authSecret,
    trustedOrigins,
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 15 * 60,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          input: true
        }
      }
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },

  });
};

