import type { SidequestConfig } from 'sidequest'
import { env as databaseEnv } from '@shared/database'

export default function getSidequestConfig(): SidequestConfig {
  const baseConfig = {
    queues: [{ name: 'mail.citizen' }, { name: 'mail.official' }],
    jobsFilePath: './jobs.ts',
    manualJobResolution: true,
    dashboard: {
      enabled: true,
    }
  }

  if (databaseEnv.ENV === "development") {
    return {
      ...baseConfig,
      backend: {
        driver: "@sidequest/sqlite-backend",
        config: {
          connection: "./sidequest.sqlite",
        }
      }
    }
  }

  return {
    ...baseConfig,
    backend: {
      driver: "@sidequest/postgres-backend",
      config: `postgresql://${databaseEnv.POSTGRES_USER}:${databaseEnv.POSTGRES_PASSWORD}@${databaseEnv.POSTGRES_HOST}:5432/${databaseEnv.POSTGRES_DB}`
    }
  }
}