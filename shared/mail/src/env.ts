import path from "node:path";
import * as v from "valibot";
import { config } from "@dotenvx/dotenvx";

config({ path: path.join(import.meta.dirname, "..", ".env") });

export const envSchema = v.object({
  SMTP_HOST: v.pipe(v.string(), v.nonEmpty()),
  SMTP_PORT: v.fallback(
    v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
    465,
  ),
  SMTP_SECURE: v.fallback(
    v.pipe(
      v.string(),
      v.transform((v) => v === "true"),
      v.boolean(),
    ),
    false,
  ),
  SMTP_USER: v.pipe(v.string(), v.includes("@")),
  SMTP_PASSWORD: v.pipe(v.string(), v.minLength(3)),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
