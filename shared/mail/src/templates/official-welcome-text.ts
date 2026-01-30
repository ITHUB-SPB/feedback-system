import type { MailOfficialWelcomeJobData } from "../types";

export const getOfficialWelcomeText = ({
  officialName,
  to,
  password
}: MailOfficialWelcomeJobData) => {

  return `Уважаемый ${officialName}! Создан аккаунт на платформе лк.вместе47предложения.рф.

Логин: ${to}

Пароль: ${password}

С наилучшими пожеланиями, команда Вместе47`;
};
