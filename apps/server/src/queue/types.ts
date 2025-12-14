import type { MailJobData } from "@shared/mail";

export enum JobType {
  Notification = "notification",
  Mail = "mail",
}

export type JobData = {
  [JobType.Notification]: { userId: string; type: string; message: string };
  [JobType.Mail]: MailJobData;
};

export type QueueType =
  | JobType.Notification
  | `${JobType.Mail}.citizen`
  | `${JobType.Mail}.official`;
