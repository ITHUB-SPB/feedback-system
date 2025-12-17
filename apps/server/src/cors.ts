import { env } from "./env";

export const trustedOrigins = [
  env.PUBLIC_WEB_URL,
  env.PUBLIC_ADMIN_URL,
  env.PUBLIC_BOT_URL,
]
  .filter((urlString) => urlString !== undefined)
  .map((url) => new URL(url).origin)
  .concat(["localhost", "https://xn--47-dlcma4bxbi.xn--p1ai"]);