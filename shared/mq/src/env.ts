import path from "node:path";
import * as v from "valibot";
import dotenv from "@dotenvx/dotenvx";

export const envSchema = v.union([
  v.object({
    ENV: v.picklist(["development", "production", "staging"]),
    REDIS_HOST: v.pipe(v.string(), v.nonEmpty()),
    REDIS_PASSWORD: v.pipe(v.string(), v.nonEmpty()),
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

export type Env = v.InferOutput<typeof envSchema>;
