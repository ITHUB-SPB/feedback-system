import { render } from "@react-email/components";

import { getCitizenStatusHtml } from "./templates/citizen-status-html.js";
import { getCitizenStatusText } from "./templates/citizen-status-text.js";
import { OfficialWelcomeEmail } from "./templates/official-welcome-html.js";
import { getOfficialWelcomeText } from "./templates/official-welcome-text.js";

import { env } from "./env";
import { mailClient } from "./client";
import { logger } from "./logger";

import type {
  MailJobData,
  MailCitizenStatusJobData,
  MailCitizenStatusWithCommentJobData,
  MailOfficialWelcomeJobData
} from "./types";

async function buildMail(options: MailJobData) {
  if ("status" in options) {
    const commonProps = {
      status: options.status,
      ...(options.status === "declined" ? { comment: options.comment } : {}),
    };

    return {
      subject: "Вместе47. Информация по вашему обращению",
      to: options.to,
      text: getCitizenStatusText(
        commonProps as
        | MailCitizenStatusJobData
        | MailCitizenStatusWithCommentJobData,
      ),
      html: await render(
        getCitizenStatusHtml({ ...commonProps, name: options.name } as
          | MailCitizenStatusJobData
          | MailCitizenStatusWithCommentJobData),
      ),
    };
  }

  if ("password" in options) {
    return {
      subject: "Вместе47. Информация по вашему обращению",
      to: options.to,
      text: getOfficialWelcomeText(options),
      html: await render(
        getOfficialWelcomeText(options),
      ),
    };
  }

  // if (options.type === "official-request") {
  //   const { officialName, description, createdAt, categoryTopic, files } =
  //     options;

  //   return {
  //     to: options.to,
  //     subject: "Вместе47. Зарегистрировано новое предложение от жителя",
  //     text: templates.officialRequestText({
  //       officialName,
  //       description,
  //       createdAt,
  //       categoryTopic,
  //     }),
  //     html: await render(
  //       templates.OfficialRequestEmail({
  //         officialName,
  //         description,
  //         createdAt,
  //         categoryTopic,
  //         files: files ?? [],
  //       }),
  //     ),
  //   };
  // }
}

export async function sendMail(options: MailJobData) {
  try {
    const mail = await buildMail(options);

    logger.info(JSON.stringify(mail))
    logger.info(JSON.stringify(options))

    return await mailClient?.sendMail({
      from: `"Вместе47" <${env.SMTP_USER}>`,
      ...mail,
    });
  } catch (error) {
    logger.error("Error on send mail" + error);
    throw error;
  }
}
