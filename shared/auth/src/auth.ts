import { betterAuth } from "better-auth"
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, superAdmin } from "./permissionControl"

export const auth = betterAuth({
  plugins: [
    adminPlugin({
      ac,
      roles: {
        superAdmin,
      }
    }),
  ],
});

