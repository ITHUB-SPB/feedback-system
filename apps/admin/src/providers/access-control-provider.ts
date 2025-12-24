import type { AccessControlProvider } from "@refinedev/core";
import { authClient } from "../auth-client";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role || "citizen";

    if (!resource || role === "moderator") {
      return { can: true };
    }

    if (role === "official") {
      // получать права через
      // authClient.admin.hasPermission()
      // информация о методе - в документации betterAuth

      const permissions: { [K: typeof resource]: string[] } = {
        voting_votes: ["list", "show"],
        feedback: ["list", "edit", "show"],
      } as const;

      return {
        can: Boolean(permissions[resource]?.includes(action)),
      };
    }

    if (role === "citizen") {
      const permissions: { [K: typeof resource]: string[] } = {
        voting_votes: ["list"],
        feedback: ["list"],
      } as const;

      return {
        can: Boolean(permissions[resource]?.includes(action)),
      };
    }

    return {
      can: false,
      reason: "Unauthorized",
    };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
  },
};
