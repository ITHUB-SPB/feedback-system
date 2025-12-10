import { betterAuth } from "better-auth"
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, admin } from "./permissionControl"

export const auth = betterAuth({
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
      }
    }),
  ],
});

