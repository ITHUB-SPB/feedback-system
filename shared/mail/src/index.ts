import { render } from "@react-email/components";

import { CitizenApprovalEmail } from './templates/citizen-approval-html.jsx'
import { citizenApprovalText } from './templates/citizen-approval-text.js'
import { CitizenRejectionEmail } from './templates/citizen-rejection-html.jsx'
import { citizenRejectionText } from './templates/citizen-rejection-text.js'
import { CitizenCompletedEmail } from './templates/citizen-completed-html.jsx'
import { citizenCompletedText } from './templates/citizen-completed-text.js'

import { env } from "./env";
import { mailClient } from "./client";
import { logger } from "./logger";

import type {
  MailJobData,
} from "./types";


async function buildMail(options: MailJobData) {
  if (options.type === "citizen-approved") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: citizenApprovalText,
      html: await render(
        CitizenApprovalEmail({ name: options.name }),
      ),
    };
  }

  if (options.type === "citizen-declined") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: citizenRejectionText,
      html: await render(
        CitizenRejectionEmail({ name: options.name }),
      ),
    };
  }

  if (options.type === "citizen-completed") {
    return {
      to: options.to,
      subject: "Вместе47. Информация по вашему обращению",
      text: citizenCompletedText,
      html: await render(
        CitizenCompletedEmail({ name: options.name }),
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
