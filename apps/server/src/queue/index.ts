import { Sidequest, type JobData } from "sidequest";
import type { OfficialRequest } from "@shared/mail/types";

import { MailCitizenJob, MailOfficialJob } from "./jobs";
import getSidequestConfig from "./config";

export async function sendCitizenEmail(
  email: string,
  name: string,
  type: "banned" | "approved" | "proceeding" | "declined" | "completed",
  comment: string | null
): Promise<JobData | null> {
  return await Sidequest.build(MailCitizenJob).enqueue({
    to: email,
    name,
    type: `citizen-${type}`,
    comment
  });
}

export async function sendOfficialEmail({
  officialName,
  email,
  description,
  categoryTopic,
  createdAt,
  files,
}: OfficialRequest): Promise<JobData | null> {
  return await Sidequest.build(MailOfficialJob).enqueue({
    to: email,
    type: "official-request",
    officialName,
    description,
    createdAt,
    categoryTopic,
    files,
  });
}

await Sidequest.start(getSidequestConfig());

console.log("sidequest dashboard: http://localhost:8678");
