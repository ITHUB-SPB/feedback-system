import type {
  MailCitizenStatusJobData,
  MailCitizenStatusWithCommentJobData,
  MailOfficialJobData,
} from "@shared/mail/types";

export enum JobType {
  CitizenStatusEmail = "citizen-status-email",
  CitizenStatusWithCommentEmail = "citizen-status-with-comment-email",
  OfficialNotificationEmail = "official-notification-email",
  OfficialWelcomeEmail = "official-welcome-email",
}

export type JobTypes =
  | JobType.CitizenStatusEmail
  | JobType.CitizenStatusWithCommentEmail
  | JobType.OfficialNotificationEmail
  | JobType.OfficialWelcomeEmail;

export type QueueName = `${JobTypes}-queue`;

export type JobData = {
  [JobType.CitizenStatusEmail]: MailCitizenStatusJobData;
  [JobType.CitizenStatusWithCommentEmail]: MailCitizenStatusWithCommentJobData;
  [JobType.OfficialNotificationEmail]: {
    userId: string;
    type: string;
    message: string;
  };
  [JobType.OfficialWelcomeEmail]: {
    userId: string;
    type: string;
    message: string;
  };
};
