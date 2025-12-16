import { os, implement } from "@orpc/server";
import { type ResponseHeadersPluginContext } from "@orpc/server/plugins";

import { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import { createLogger } from "@shared/logger";
import apiContract from "./contracts";

type Env = {
  ENV: "production" | "staging" | "development";
  SERVER_AUTH_SECRET: string;
  PUBLIC_SERVER_URL: string;
  PUBLIC_WEB_URL: string;
  PUBLIC_ADMIN_URL: string;
  PUBLIC_BOT_URL?: string | undefined;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_ENDPOINT: string;
  MINIO_PUBLIC_URL?: string | undefined;
};

type CreateORPCContext = {
  auth: AuthInstance;
  db: typeof dbInstance;
  environment: Env;
  headers: Headers;
};

export const createORPCContext = async ({
  auth,
  db,
  environment,
  headers,
}: CreateORPCContext): Promise<{
  db: typeof dbInstance;
  session: AuthInstance["$Infer"]["Session"] | null;
  auth: typeof auth;
  environment: Env;
  headers: Headers;
}> => {
  const session = await auth.api.getSession({
    headers,
  });

  return {
    db,
    auth,
    session,
    environment,
    headers,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const logger = createLogger({ env: "development" });
  const start = Date.now();
  const result = await next();
  const end = Date.now();

  logger.info(`\t[RPC] /${path.join("/")} executed after ${end - start}ms`);

  return result;
});

const base = implement(apiContract);

export interface Context
  extends Awaited<ReturnType<typeof createORPCContext>>,
    ResponseHeadersPluginContext {}

export const publicProcedure = base.$context<Context>().use(timingMiddleware);

const protectedProcedure = publicProcedure.use(
  async ({ context, next, errors }) => {
    if (!context.session?.user) {
      throw errors.UNAUTHORIZED();
    }

    return next({
      context: {
        session: { ...context.session },
      },
    });
  },
);

export const requireOfficialProcedure = protectedProcedure.use(
  async ({ context, next, errors }) => {
    const role = context.session.user.role;
    if (!role) {
      throw errors.UNAUTHORIZED();
    }

    return next({
      context: {
        session: { ...context.session },
      },
    });
  },
);

export const requireModeratorProcedure = protectedProcedure.use(
  async ({ context, next, errors }) => {
    const role = context.session.user.role;

    if (role !== "moderator") {
      throw errors.UNAUTHORIZED();
    }

    return next({
      context: {
        session: { ...context.session },
      },
    });
  },
);
