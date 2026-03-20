import { render } from "@react-email/components";

import { getCitizenStatusHtml } from "./templates/citizen-status-html.js";
import { getCitizenStatusText } from "./templates/citizen-status-text.js";
import { OfficialWelcomeEmail } from "./templates/official-welcome-html.js";
import { getOfficialWelcomeText } from "./templates/official-welcome-text.js";
import { getInnerWelcomeText } from "./templates/inner-welcome-text.js";
import { InnerWelcomeEmail } from "./templates/inner-welcome-html.js";

import { env } from "./env";
import { mailClient } from "./client";
import { logger } from "./logger";

import type { MailJobData } from "./types";

async function buildMail(options: MailJobData) {
  if ("status" in options && "comment" in options) {
    return {
      subject: "Вместе47. Информация по вашему обращению",
      to: options.to,
      text: getCitizenStatusText({
        status: options.status,
        comment: options.comment,
      }),
      html: await render(
        getCitizenStatusHtml({
          status: options.status,
          comment: options.comment,
          name: options.name,
        }),
      ),
    };
  }

  if ("status" in options) {
    return {
      subject: "Вместе47. Информация по вашему обращению",
      to: options.to,
      text: getCitizenStatusText({
        status: options.status,
      }),
      html: await render(
        getCitizenStatusHtml({ status: options.status, name: options.name }),
      ),
    };
  }

  if ("password" in options && "to" in options) {
    return {
      subject: "Вместе47. Регистрация на платформе обращений",
      to: options.to,
      text: getOfficialWelcomeText(options),
      html: await render(OfficialWelcomeEmail(options)),
    };
  }

  if ("password" in options && "email" in options) {
    return {
      subject: "Вместе47. Новая регистрация на платформе обращений",
      to: env.SMTP_USER,
      text: getInnerWelcomeText(options),
      html: await render(InnerWelcomeEmail(options)),
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

    logger.info(JSON.stringify(mail));
    logger.info(JSON.stringify(options));

    return await mailClient?.sendMail({
      from: `"Вместе47" <${env.SMTP_USER}>`,
      ...mail,
    });
  } catch (error) {
    logger.error("Error on send mail" + error);
    throw error;
  }
}
