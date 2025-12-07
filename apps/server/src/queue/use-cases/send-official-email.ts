import { officialEmailQueue } from "../buildQueue";
import type { OfficialRequest } from "@shared/mail";

export default async function sendOfficialEmail({
  officialName,
  email,
  description,
  categoryTopic,
  createdAt,
  files,
}: OfficialRequest): Promise<string | undefined> {
  try {
    logger.info(
      {
        email: email,
      },
      "Creating official email job",
    );

    const job = await officialEmailQueue.add(
      "official-request",
      {
        to: email,
        type: 'official-request',
        officialName,
        description,
        createdAt,
        categoryTopic,
        files,
      },
      {
        priority: 1, // High
      },
    );

    return job.id;
  } catch (error) {
    logger.error({ error, email }, "Error creating official email");
    throw error;
  }
}
