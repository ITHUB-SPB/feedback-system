import { citizenApprovedEmailQueue, citizenRejectedEmailQueue } from "../buildQueue";

export default async function sendCitizenEmail(
  email: string,
  name: string,
  approved: boolean,
): Promise<string | undefined> {
  try {
    logger.info(
      {
        email: email,
        name: name,
      },
      "Creating citizen email job",
    );

    if (approved) {
      const job = await citizenApprovedEmailQueue.add(
        "citizen-approved",
        {
          to: email,
          name,
          type: "citizen-approved"
        },
        {
          priority: 1,
        },
      );

      return job.id;
    }

    const job = await citizenRejectedEmailQueue.add(
      "citizen-rejected",
      {
        to: email,
        name,
        type: "citizen-rejected"
      },
      {
        priority: 1,
      },
    );

    return job.id;
  } catch (error) {
    logger.error({ error, email }, "Error creating citizen email");
    throw error;
  }
}
