import React from "react";

import type { MailOfficialWelcomeJobData } from "../types";

import {
  Body,
  CodeInline,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Link,
} from "@react-email/components";

export const OfficialWelcomeEmail = ({
  officialName,
  to,
  password
}: MailOfficialWelcomeJobData) => {
  return (
    <Html dir="ltr" lang="ru">
      <Tailwind>
        <Head />
        <Preview>
          Уважаемый {officialName}! На платформу вместе47.рф поступило новое
          предложение.
        </Preview>
        <Body className="bg-[#f2f2fa] py-[40px] font-sans">
          <Container className="mx-auto max-w-[720px] rounded-[8px] bg-white px-[40px] py-[40px]">
            <Section className="mb-[32px] text-center">
              <Img
                alt="логотип"
                className="mx-auto h-auto w-full max-w-[120px]"
                src="https://minio.xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/photos/2025-10-01T03:27:09.294Z_logo.png"
              />
            </Section>

            <Section>
              <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
                Уважаемый {officialName}! Создан аккаунт на платформе <Link href="https://xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/">вместе47предложения.рф</Link>. 
              </Heading>

              <Section className="mb-[24px] rounded-[0px] border-[#e6e6f0] border-[1px] border-solid bg-[#f8f8ff] p-[18px]">
                <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                  Логин
                </Heading>
                <Text className="m-0 mb-[16px] text-[#0b0917] text-[14px] leading-[20px]">
                  {to}
                </Text>
                <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                  Пароль
                </Heading>
                <Text className="m-0 mb-[16px] text-[#0b0917] text-[14px] leading-[20px]">
                  {password}
                </Text>
              </Section>

              <Text className="mb-[20px] text-[#0b0917] text-[16px] leading-[24px]">
                Официальная электронная почта Центра
                компетенций Ленинградской области:{" "}
                <CodeInline>cc.lenreg@sreda47.ru</CodeInline>.
              </Text>
            </Section>

            <Hr className="my-[32px] border-[#e6e6f0]" />

            <Text className="m-0 mt-[16px] text-[#666666] text-[12px] leading-[16px]">
              © Вместе47.рф
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
