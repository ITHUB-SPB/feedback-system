import { Job, type RedisClient, Worker, type Processor } from "bullmq";
import type {
  MailCitizenStatusJobData,
  MailCitizenStatusWithCommentJobData,
  MailOfficialWelcomeJobData
} from "@shared/mail/types";
import { sendMail } from "@shared/mail";
import { logger } from "./logger";
import type { QueueName } from "./types";
import { RedisConnection } from "./connection";

const defaultEventHandlers = {
  active: (job: Job) => {
    logger.info(`Job ${job.name} started`);
  },
  completed: (job: Job) => {
    logger.info(`Job ${job.name} completed`);
  },
  failed: (job: Job | undefined, error: Error) => {
    logger.error(
      `Job ${job?.name} failed with <${error.name}>${error.message}`,
    );
  },
  error: (error: Error) => {
    logger.error(error);
  },
};

export default function buildWorker(
  queueName: QueueName,
  handler: Processor,
  connection: RedisClient,
  eventHandlers = defaultEventHandlers,
) {
  if (!connection) {
    throw new Error("Couldn't connect to Redis");
  }

  const worker = new Worker(queueName, handler, { connection });

  worker.on("active", eventHandlers.active);
  worker.on("completed", eventHandlers.completed);
  worker.on("failed", eventHandlers.failed);
  worker.on("error", eventHandlers.error);

  return worker;
}

export function buildCitizenStatusEmailWorker(connection: RedisConnection) {
  const sendCitizenStatusEmail = async (
    job: Job<MailCitizenStatusJobData>,
  ): Promise<string | undefined> => {
    await sendMail(job.data);
    return job.id;
  };

  return buildWorker(
    "citizen-status-email-queue",
    sendCitizenStatusEmail,
    connection,
  );
}

export function buildCitizenStatusWithCommentEmailWorker(
  connection: RedisConnection,
) {
  const sendCitizenStatusWithCommentEmail = async (
    job: Job<MailCitizenStatusWithCommentJobData>,
  ): Promise<string | undefined> => {
    await sendMail(job.data);
    return job.id;
  };

  return buildWorker(
    "citizen-status-with-comment-email-queue",
    sendCitizenStatusWithCommentEmail,
    connection,
  );
}

export function buildOfficialWelcomeEmailWorker(
  connection: RedisConnection,
) {
  const sendOfficialWelcomeEmail = async (
    job: Job<MailOfficialWelcomeJobData>,
  ): Promise<string | undefined> => {
    await sendMail(job.data);
    return job.id;
  };

  return buildWorker(
    "official-welcome-email-queue",
    sendOfficialWelcomeEmail,
    connection,
  );
}
