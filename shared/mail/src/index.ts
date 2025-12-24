import { render } from "@react-email/components";

import * as emailTemplates from "./templates";

import { env } from "./env";
import { mailClient } from "./client";
import { logger } from "./logger";
import type {
  MailJobData,
  MailCitizenJobData,
  MailOfficialJobData,
  OfficialRequest,
} from "./types";

export type {
  MailJobData,
  OfficialRequest,
  MailCitizenJobData,
  MailOfficialJobData,
};

async function buildMail(options: MailJobData) {
  if (options.type === "citizen-approved") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: emailTemplates.citizenApprovalText,
      html: await render(
        emailTemplates.CitizenApprovalEmail({ name: options.name }),
      ),
    };
  }

  if (options.type === "citizen-declined") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: emailTemplates.citizenRejectionText,
      html: await render(
        emailTemplates.CitizenRejectionEmail({ name: options.name }),
      ),
    };
  }

  if (options.type === "citizen-completed") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: emailTemplates.citizenCompletedText,
      html: await render(
        emailTemplates.CitizenCompletedEmail({ name: options.name }),
      ),
    };
  }

  if (options.type === "official-request") {
    const { officialName, description, createdAt, categoryTopic, files } =
      options;

    return {
      to: options.to,
      subject: "Вместе47. Зарегистрировано новое предложение от жителя",
      text: emailTemplates.officialRequestText({
        officialName,
        description,
        createdAt,
        categoryTopic,
      }),
      html: await render(
        emailTemplates.OfficialRequestEmail({
          officialName,
          description,
          createdAt,
          categoryTopic,
          files: files ?? [],
        }),
      ),
    };
  }
}

export async function sendMail(options: MailJobData) {
  try {
    const mail = await buildMail(options);

    return await mailClient?.sendMail({
      from: `"Вместе47" <${env.SMTP_USER}>`,
      to: mail?.to,
      subject: mail?.subject,
      text: mail?.text,
      html: mail?.html,
    });
  } catch (error) {
    logger.error("Error on send mail" + error);
  }
}
