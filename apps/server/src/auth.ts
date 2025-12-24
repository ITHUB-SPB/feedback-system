import { createAuth, type AuthInstance } from "@shared/auth";
import { db } from "@shared/database";
import { trustedOrigins } from "./cors";
import { env } from "./env";

const auth: AuthInstance = createAuth({
  trustedOrigins,
  serverUrl: env.PUBLIC_SERVER_URL,
  apiPath: "/api",
  authSecret: env.SERVER_AUTH_SECRET,
  db,
});

export default auth;
