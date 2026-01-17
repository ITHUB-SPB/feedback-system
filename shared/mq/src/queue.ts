import { Queue } from "bullmq";
import type { RedisConnection } from "./connection";
import type { JobType, JobData, QueueName } from "./types";

const defaultJobOptions = {
  attempts: 50,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: {
    age: 24 * 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600,
  },
};

export default function getQueue<J extends JobType>(
  queueName: QueueName,
  connection: RedisConnection,
) {
  if (!connection) {
    throw new Error("Couldn't connect to Redis");
  }

  return new Queue<JobData[J]>(queueName, {
    connection,
    defaultJobOptions,
  });
}
