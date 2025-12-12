import "better-auth";

declare module "better-auth" {

  interface signUpParams {
    role?: "superAdmin" | "moderator" | "official" | "citizen",
  }

  interface user {
    role?: "string";
  }
}

declare module "better-auth/api" {
  interface OpenAPIConfig {
    components?: {
      schemas?: {
        SignUpBody?: {
          role?: {
            type: "string";
            enum: ["superAdmin", "moderator", "official", "citizen"];
            default: "citizen";
          };
        };
      };
    };
  }
}