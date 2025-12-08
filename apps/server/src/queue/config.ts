import { env as databaseEnv, useLiteServer } from '@shared/database'

async function getSidequestBackendConfig() {
  if (databaseEnv.ENV === "development") {
    await useLiteServer().start()
    return 'postgresql://postgres:postgres@localhost:5432/feedback'
  }

  return `postgresql://${databaseEnv.POSTGRES_USER}:${databaseEnv.POSTGRES_PASSWORD}@${databaseEnv.POSTGRES_HOST}:5432/${databaseEnv.POSTGRES_DB}`
}

export default async function getSidequestConfig() {
  return {
    backend: {
      driver: "@sidequest/postgres-backend",
      config: await getSidequestBackendConfig()
    },
    queues: [{ name: 'mail.citizen' }, { name: 'mail.official' }],
    jobsFilePath: './jobs',
    manualJobResolution: true,
    dashboard: {
      enabled: true,
      basePath: "/sidequest",
    }
  }
}