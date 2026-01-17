export type MailCitizenStatusWithCommentJobData = {
  to: string;
  name: string;
  attachments?: string[];
  status: "declined";
  comment: string;
};

export type MailCitizenStatusJobData = {
  to: string;
  name: string;
  status: "banned" | "approved" | "proceeding" | "completed";
};

export type MailOfficialJobData = {
  to: string;
  officialName: string;
  type: "official-request";
  description: string;
  categoryTopic: string | undefined;
  createdAt: string;
  files?: string[];
};

export type OfficialRequest = {
  email: string;
  officialName: string;
  description: string;
  categoryTopic: string | undefined;
  createdAt: string;
  files: string[];
};

export type MailJobData =
  | MailCitizenStatusJobData
  | MailCitizenStatusWithCommentJobData
  | MailOfficialJobData;
