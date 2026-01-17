import React from "react";

import {
  Body,
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
} from "@react-email/components";

import type {
  MailCitizenStatusJobData,
  MailCitizenStatusWithCommentJobData,
} from "../types";

interface Props {
  name: string;
}

interface BaseProps {
  PreviewComponent: React.ReactElement;
  ContentComponent: React.ReactElement;
}

const CitizenStatusEmail = ({
  PreviewComponent,
  ContentComponent,
}: BaseProps) => (
  <Html dir="ltr" lang="ru">
    <Tailwind>
      <Head />
      {PreviewComponent}
      <Body className="bg-[#f2f2fa] py-[40px] font-sans">
        <Container className="mx-auto max-w-[720px] rounded-[8px] bg-white px-[40px] py-[40px]">
          <Section className="mb-[32px] text-center">
            <Img
              alt="логотип"
              className="mx-auto h-auto w-full max-w-[120px]"
              src="https://minio.xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/photos/2025-10-01T03:27:09.294Z_logo.png"
            />
          </Section>
          {ContentComponent}
          <Hr className="my-[32px] border-[#e6e6f0]" />
          <Text className="text-[#0b0917] text-[16px] leading-[24px]">
            С наилучшими пожеланиями, команда Вместе47
          </Text>
          <Text className="m-0 mt-[16px] text-[#666666] text-[12px] leading-[16px]">
            © Вместе47.рф
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

const CitizenStatusApprovedEmail = ({ name }: Props) => {
  const PreviewComponent = (
    <Preview>Уважаемый житель! Ваше обращение принято в работу!</Preview>
  );

  const ContentComponent = (
    <Section>
      <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
        {name}!
      </Heading>

      <Text className="mb-[24px] text-[#0b0917] text-[16px]">
        Ваше предложение принято в работу. Благодарим Вас за вклад в
        благоустройство Ленинградской области!
      </Text>
    </Section>
  );

  return (
    <CitizenStatusEmail
      PreviewComponent={PreviewComponent}
      ContentComponent={ContentComponent}
    />
  );
};

const CitizenStatusCompletedEmail = ({ name }: Props) => {
  const PreviewComponent = (
    <Preview>Уважаемый житель! Работы по Вашему обращению выполнены!</Preview>
  );

  const ContentComponent = (
    <Section>
      <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
        {name}!
      </Heading>

      <Text className="mb-[24px] text-[#0b0917] text-[16px]">
        Работы по Вашему предложению проведены. Благодарим Вас за вклад в
        благоустройство Ленинградской области!
      </Text>
    </Section>
  );

  return (
    <CitizenStatusEmail
      PreviewComponent={PreviewComponent}
      ContentComponent={ContentComponent}
    />
  );
};

const CitizenStatusDeclinedEmail = ({
  name,
  comment,
}: Props & { comment: string }) => {
  const PreviewComponent = (
    <Preview>Уважаемый житель! Ваше предложение было отклонено АМО.</Preview>
  );

  const ContentComponent = (
    <Section>
      <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
        {name}!
      </Heading>

      <Text className="mb-[24px] text-[#0b0917] text-[16px]">
        Ваше предложение было отклонено АМО. Причина отклонения: ${comment}
      </Text>
    </Section>
  );

  return (
    <CitizenStatusEmail
      PreviewComponent={PreviewComponent}
      ContentComponent={ContentComponent}
    />
  );
};

const CitizenStatusBannedEmail = ({ name }: Props) => {
  const PreviewComponent = (
    <Preview>Уважаемый житель, Ваше сообщение нуждается в уточнении</Preview>
  );

  const ContentComponent = (
    <Section>
      <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
        {name}!
      </Heading>

      <Text className="mb-[20px] text-[#0b0917] text-[16px] leading-[24px]">
        К сожалению, Ваше обращение было отклонено нашими модераторами по
        причине несоответствия требованиям. Пожалуйста, ознакомьтесь с
        требованиями, указанными ниже
      </Text>

      <Section className="mb-[24px] rounded-[0px] border-[#e6e6f0] border-[1px] border-solid bg-[#f8f8ff] p-[18px]">
        <Heading className="mb-[16px] font-bold text-[#0b0917] text-[16px]">
          Требования к обратной связи по благоустройству
        </Heading>
        <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
          • предложение относится к сфере благоустройства городов Ленинградской
          области;
        </Text>
        <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
          • предложение относится к территории, благоустроенной в рамках
          государственной программы «Формирование городской среды и обеспечение
          качественным жильем граждан на территории Ленинградской области»,
          утвержденной постановлением Правительства Ленинградской области от
          14.11.2013 №407;
        </Text>
        <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
          • соблюдение этических норм общения — использование ненормативной
          лексики и оскорбительных выражений не допускается;
        </Text>
        <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
          • описание предложения максимально подробно, избегая общих фраз («У
          нас всё плохо», «Сделайте красиво», «Здесь некомфортно» и т.п.).
        </Text>
      </Section>
    </Section>
  );

  return (
    <CitizenStatusEmail
      PreviewComponent={PreviewComponent}
      ContentComponent={ContentComponent}
    />
  );
};

CitizenStatusApprovedEmail.PreviewProps = {
  name: "Антонина Юрьевна",
};

CitizenStatusCompletedEmail.PreviewProps = {
  name: "Фёдор Павлович Юрьевна",
};

CitizenStatusBannedEmail.PreviewProps = {
  name: "Алексей Вячеславович",
};

export const getCitizenStatusHtml = (
  props:
    | Pick<MailCitizenStatusJobData, "name" | "status">
    | Pick<MailCitizenStatusWithCommentJobData, "name" | "status" | "comment">,
) => {
  switch (props.status) {
    case "approved":
      return <CitizenStatusApprovedEmail name={props.name} />;
    case "banned":
      return <CitizenStatusBannedEmail name={props.name} />;
    case "completed":
      return <CitizenStatusCompletedEmail name={props.name} />;
    case "declined":
      return (
        <CitizenStatusDeclinedEmail name={props.name} comment={props.comment} />
      );
  }
};
