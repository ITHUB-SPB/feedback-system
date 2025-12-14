import type { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    console.log(resource); // products, orders, etc.
    console.log(action); // list, edit, delete, etc.
    console.log(params); // { id: 1 }, { id: 2 }, etc.

    let role = "official";

    if (!resource || role === "superadmin") {
      return { can: true };
    }

    if (role === "moderator" && resource !== "users") {
      return { can: true };
    }

    if (role === "official") {
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

      console.log(Boolean(permissions[resource]?.includes(action)));
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
