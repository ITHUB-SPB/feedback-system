// import { Queue } from "bullmq";

import type { JobType, JobData } from "./types";

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

function buildQueue<J extends JobType>(queueName: string) {
  if (!redisClient) {
    throw new Error("Something wrong with Redis client");
  }

  return new Queue<JobData[J]>(queueName, {
    connection: redisClient,
    defaultJobOptions,
  });
};

export const citizenApprovedEmailQueue =
  buildQueue<JobType.Mail>("citizen-approved");

export const citizenRejectedEmailQueue =
  buildQueue<JobType.Mail>("citizen-rejected");

export const officialEmailQueue = buildQueue<JobType.Mail>("official-request");
