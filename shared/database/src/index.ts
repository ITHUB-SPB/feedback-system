import { KyselyPGlite } from "kysely-pglite";
import { Pool } from "pg";
import { Kysely, PostgresDialect, ParseJSONResultsPlugin } from "kysely";

import { parseEnv } from "./env";
import type { Database } from "./interface";

async function getDialect() {
  const env = parseEnv();

  if (env.ENV === "production" || env.ENV === "staging") {
    const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
      env;

    const POSTGRES_DATABASE_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}`;

    return new PostgresDialect({
      pool: new Pool({
        connectionString: POSTGRES_DATABASE_URI,
        ssl: env.ENV === "production",
      }),
    });
  }

  if (env.ENV === "development") {
    return (await KyselyPGlite.create(env.PGLITE_DATABASE_URI)).dialect;
  }

  throw new Error("Incorrect ENV value");
}

export const db = new Kysely<Database>({
  dialect: await getDialect(),
  plugins: [new ParseJSONResultsPlugin()],
});

export { type Database, parseEnv };
