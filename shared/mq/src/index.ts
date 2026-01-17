import getConnection from "./connection";
import getQueue from "./queue";
import { JobType } from "./types";

const connection = getConnection();

export const citizenStatusEmailQueue = getQueue<JobType.CitizenStatusEmail>(
  "citizen-status-email-queue",
  connection,
);

export const citizenStatusWithCommentEmailQueue =
  getQueue<JobType.CitizenStatusWithCommentEmail>(
    "citizen-status-with-comment-email-queue",
    connection,
  );

citizenStatusEmailQueue.add("test", {
  name: "test",
  status: "completed",
  to: "daslef93@gmail.com",
});

citizenStatusWithCommentEmailQueue.add("test", {
  name: "test",
  status: "declined",
  comment: "Не актуально.",
  to: "daslef93@gmail.com",
});
