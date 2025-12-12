import { betterAuth } from "better-auth"
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, superAdmin, moderator, official, citizen } from "./permissionControl"

export const auth = betterAuth({
  plugins: [
    adminPlugin({
      ac,
      roles: {
        superAdmin,
        moderator,
        official,
        citizen,
      }
    }),
  ],
});

