import type { MailInnerWelcomeJobData } from "../types";

export const getInnerWelcomeText = ({
  officialName,
  email,
  password,
}: MailInnerWelcomeJobData) => {
  return `Создан новый аккаунт на платформе лк.вместе47предложения.рф.

Ответственное лицо: ${officialName}  

Логин: ${email}

Пароль: ${password}
`;
};
