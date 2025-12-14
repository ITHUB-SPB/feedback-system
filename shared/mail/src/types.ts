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
  type: "citizen-approved" | "citizen-rejected";
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
