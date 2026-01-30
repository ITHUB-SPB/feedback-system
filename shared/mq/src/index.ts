import getConnection from "./connection";
import getQueue from "./queue";
import { JobType } from "./types";

const connection = getConnection();

export const officialEmailQueue = getQueue<JobType.OfficialWelcomeEmail>(
  "official-welcome-email-queue",
  connection,
);

export const citizenStatusEmailQueue = getQueue<JobType.CitizenStatusEmail>(
  "citizen-status-email-queue",
  connection,
);

export const citizenStatusWithCommentEmailQueue =
  getQueue<JobType.CitizenStatusWithCommentEmail>(
    "citizen-status-with-comment-email-queue",
    connection,
  );
