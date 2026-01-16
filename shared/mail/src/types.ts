export type OfficialRequest = {
  email: string;
  officialName: string;
  description: string;
  categoryTopic: string | undefined;
  createdAt: string;
  files: string[];
};

export type MailCitizenJobData = {
  to: string;
  type: "citizen-approved" | "citizen-completed" | "citizen-declined" | "citizen-proceeding" | "citizen-banned";
  comment: string | null,
  name: string;
  attachments?: string[];
};

export type MailOfficialJobData = {
  to: string;
  type: "official-request";
  officialName: string;
  description: string;
  categoryTopic: string | undefined;
  createdAt: string;
  files?: string[];
};

export type MailJobData = MailCitizenJobData | MailOfficialJobData;
