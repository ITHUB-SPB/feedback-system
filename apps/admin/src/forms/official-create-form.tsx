import type { ChangeEvent } from "react";

import Form from "antd/es/form";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";
import Divider from "antd/es/divider";

import type { UseModalFormFromQueryReturnType } from "@/components/forms/use-modal-form-from-query";
import type { User } from "@/types";

type OfficialCreateModalFormProps = {
  officialCreateModalProps: UseModalFormFromQueryReturnType<User>["modalProps"];
  officialCreateFormProps: UseModalFormFromQueryReturnType<User>["formProps"];
};

export default function OfficialCreateModalForm({
  officialCreateModalProps,
  officialCreateFormProps,
}: OfficialCreateModalFormProps) {
  const { form, ...formProps } = officialCreateFormProps;

  return (
    <Modal
      {...officialCreateModalProps}
      width={540}
      title="Новое ответственное лицо"
    >
      <Form form={form} {...formProps} layout="vertical">
        <Divider titlePlacement="start">ФИО</Divider>
        <Flex gap={16}>
          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Заполните поле",
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Заполните поле",
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name="middleName"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Divider titlePlacement="start">Контакты</Divider>
        <Flex gap={16}>
          <Form.Item
            label="Почта"
            name="email"
            rules={[
              {
                required: true,
                message: "Заполните поле",
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input
              type="email"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                form?.setFieldValue("name", event.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                required: false,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
}
