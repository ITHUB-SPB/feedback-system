import type { SidequestConfig } from "sidequest";
import { parseEnv as parseDatabaseEnv } from "@shared/database";
import { env } from "../env";

export default function getSidequestConfig(): SidequestConfig {
  const baseConfig = {
    queues: [{ name: "mail.citizen" }, { name: "mail.official" }],
    dashboard: {
      enabled: true,
    },
    manualJobResolution: true,
    jobsFilePath: "./jobs.ts",
  };

  if (env.ENV === "development") {
    return {
      ...baseConfig,
      backend: {
        driver: "@sidequest/sqlite-backend",
        config: {
          connection: "./sidequest.sqlite",
        },
      },
    };
  }

  const databaseEnv = parseDatabaseEnv(env.ENV);

  if (databaseEnv.ENV === "development") {
    return {
      ...baseConfig,
      backend: {
        driver: "@sidequest/sqlite-backend",
        config: {
          connection: "./sidequest.sqlite",
        },
      },
    };
  }

  return {
    ...baseConfig,
    backend: {
      driver: "@sidequest/postgres-backend",
      config: `postgresql://${databaseEnv.POSTGRES_USER}:${databaseEnv.POSTGRES_PASSWORD}@${databaseEnv.POSTGRES_HOST}:5432/${databaseEnv.POSTGRES_DB}`,
    },
  };
}
