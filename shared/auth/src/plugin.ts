import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";


export const adminPLugin = (options: ) => {
  return {
    id: "my-plugin",
  } satisfies BetterAuthPlugin
}