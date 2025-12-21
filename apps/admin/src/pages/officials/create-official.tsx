import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Modal from "antd/es/modal";
import Flex from "antd/es/flex";

import { authClient } from "../../providers/auth-provider";
import type { CreateOfficialModalFormProps, NewUserRecord } from './types'

export default function CreateOfficialModalForm({
  createOfficialModalProps,
  createOfficialFormProps
}: CreateOfficialModalFormProps) {
  return (
    <Modal {...createOfficialModalProps} title="Новое ответственное лицо">
      <Form
        {...createOfficialFormProps}
        layout="vertical"
        style={{ marginTop: 24 }}
        onFinish={async (values: NewUserRecord) => {
          await authClient.admin.createUser({
            email: values.email,
            password: "1234356sh28!",
            name: values.email,
            role: values.role,
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              middleName: values.middleName,
              phone: values.phone,
              social: values.social,
            },
          });
        }}
      >
        <Flex gap={16}>
          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[
              {
                required: true,
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
                required: false,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Flex gap={16}>
          <Form.Item
            label="Почта"
            name="email"
            rules={[
              {
                required: true,
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
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
          <Form.Item
            label="Соцсеть"
            name="social"
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

        <Form.Item
          label="Тип"
          name="role"
          rules={[
            {
              required: true,
            },
          ]}
        // hidden={true}
        >
          <Select
            options={[
              { value: "moderator", label: "moderator" },
              { value: "official", label: "official" },
            ]}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>

  )
}