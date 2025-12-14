import { Job, logger } from "sidequest";
import type { MailCitizenJobData, MailOfficialJobData } from "@shared/mail";
import { sendMail } from "@shared/mail";

export class MailCitizenJob extends Job {
  async run(jobData: MailCitizenJobData) {
    const log = logger("Mail.Citizen");

    log.info("Processing job", jobData);

    try {
      await sendMail(jobData);
      log.info("Job completed", jobData.to);
    } catch (error: unknown) {
      log.error("Job failed", { error: (error as Error)?.message, jobData });
      throw error;
    }

    return { ...jobData, sent: true, timestamp: new Date() };
  }
}

export class MailOfficialJob extends Job {
  async run(jobData: MailOfficialJobData) {
    const log = logger("Mail.Official");

    log.info("Processing job", jobData);

    try {
      await sendMail(jobData);
      log.info("Job completed", jobData.to);
    } catch (error: unknown) {
      log.error("Job failed", { error: (error as Error)?.message, jobData });
      throw error;
    }

    return { ...jobData, sent: true, timestamp: new Date() };
  }
}
