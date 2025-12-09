import { env as databaseEnv } from '@shared/database'

export default function getSidequestConfig() {
  return {
    backend: databaseEnv.ENV === "development" ? {
      driver: "@sidequest/sqlite-backend",
      config: databaseEnv.PGLITE_DATABASE_URI
    } : {
      driver: "@sidequest/postgres-backend",
      config: `postgresql://${databaseEnv.POSTGRES_USER}:${databaseEnv.POSTGRES_PASSWORD}@${databaseEnv.POSTGRES_HOST}:5432/${databaseEnv.POSTGRES_DB}`
    },
    queues: [{ name: 'mail.citizen' }, { name: 'mail.official' }],
    jobsFilePath: './jobs.ts',
    manualJobResolution: true,
    dashboard: {
      enabled: true,
      basePath: "/sidequest",
    }
  }
}