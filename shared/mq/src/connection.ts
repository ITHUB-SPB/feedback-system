import IORedis from "ioredis";
import { parseEnv } from "./env";

export default function getConnection() {
  const env = parseEnv();

  return new IORedis({
    host: env.REDIS_HOST,
    port: 6379,
    username: env.REDIS_USER,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  });
}

export type RedisConnection = ReturnType<typeof getConnection>;
