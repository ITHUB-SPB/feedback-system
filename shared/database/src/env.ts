import path from "node:path";

import * as v from "valibot";
import dotenv from "@dotenvx/dotenvx";

export const envSchema = v.union([
  v.object({
    ENV: v.picklist(["production", "staging"]),
    POSTGRES_HOST: v.string(),
    POSTGRES_USER: v.string(),
    POSTGRES_PASSWORD: v.string(),
    POSTGRES_DB: v.string(),
  }),
  v.object({
    ENV: v.literal("development"),
    PGLITE_DATABASE_URI: v.string(),
  }),
]);

export const parseEnv = (
  environment?: "production" | "staging" | "development" | undefined,
) => {
  try {
    return v.parse(envSchema, process.env);
  } catch {
    const fileName = `.env.${environment || process.env.ENV}`;
    dotenv.config({
      path: path.join(import.meta.dirname, "..", fileName),
    });
    return v.parse(envSchema, process.env);
  }
};
