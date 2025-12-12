import { betterAuth } from "better-auth"
import { ac, superAdmin, moderator, official, citizen } from "./permissionControl"

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        role: "string",
      },
    }
  }
});

