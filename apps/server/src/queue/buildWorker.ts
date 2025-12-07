import { sendMail } from '@shared/mail';
import { createLogger } from '@shared/logger';

const logger = createLogger({ env: 'development' })

const defaultEventHandlers = {
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

function buildWorker(
  jobName: string,
  handler: Processor,
  eventHandlers = defaultEventHandlers,
) {
  if (!redisClient) {
    throw new Error("Something wrong with Redis client");
  }

  const worker = new Worker(jobName, handler, { connection: redisClient });
  worker.on("completed", eventHandlers.completed);
  worker.on("failed", eventHandlers.failed);
  worker.on("error", eventHandlers.error);

  return worker;
}

export default function (queueName: string) {
  logger.info(`mail worker "${queueName}" started`);

  return buildWorker(queueName, async (job) => {
    await sendMail(job.data);
  });
}
