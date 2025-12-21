import { type BetterAuthOptions, betterAuth } from "better-auth";
import { admin, openAPI, customSession } from "better-auth/plugins";
import { ac, roles } from "./permissionControl";

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
      admin({
        ac,
        roles,
      }),
    ],
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          input: true,
          defaultValue: "citizen",
          returned: true,
        },
        firstName: {
          type: "string",
          required: true,
          input: true,
          returned: true,
        },
        lastName: {
          type: "string",
          required: false,
          input: true,
          returned: true,
        },
        middleName: {
          type: "string",
          required: false,
          input: true,
          returned: true,
        },
        phone: {
          type: "string",
          required: false,
          input: true,
          returned: true,
        },
        social: {
          type: "string",
          required: false,
          input: true,
          returned: true,
        },
      },
    },
  }) satisfies BetterAuthOptions;

export const createAuth = ({
  trustedOrigins,
  serverUrl,
  apiPath,
  db,
  authSecret,
}: AuthOptions) => {
  const baseOptions = getBaseOptions(db);

  return betterAuth({
    ...baseOptions,
    baseURL: `${serverUrl}${apiPath}/auth`,
    secret: authSecret,
    trustedOrigins,
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 15 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
      disableSignUp: true,
    },
    advanced:
      serverUrl.includes(':')
        ? {}
        : {
          cookies: {
            session_token: {
              attributes: {
                sameSite: "none",
                secure: false, // TODO
                httpOnly: true,
              },
            },
          },
        },
    plugins: [
      ...baseOptions.plugins,
      customSession(async ({ user, session }) => {
        return {
          role: user.role,
          user: {
            ...user,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            phone: user.phone,
            social: user.social,
          },
          session,
        };
      }, baseOptions),
    ],
  });
};
