import React from "react";
import { type LoginPageProps, type LoginFormTypes } from "@refinedev/core";
import { authClient } from "@/providers/auth-client";

import {
  bodyStyles,
  containerStyles,
  headStyles,
  layoutStyles,
  titleStyles,
} from "./styles";

import Row from "antd/es/row";
import Col from "antd/es/col";
import Layout from "antd/es/layout";
import Card from "antd/es/card";
import Typography from "antd/es/typography";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import theme from "antd/es/theme";

import { type CardProps, type LayoutProps, type FormProps } from "antd";

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;

export const LoginCard: React.FC<LoginProps> = ({
  rememberMe,
  renderContent,
  formProps,
  mutationVariables,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      Вход в личный кабинет
    </Typography.Title>
  );

  const CardContent = (
    <Card
      title={CardTitle}
      styles={{
        header: headStyles,
        body: bodyStyles,
      }}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <Form<LoginFormTypes>
        layout="vertical"
        form={form}
        onFinish={async ({ email, password, remember }) => {
          if (!email || !password) {
            return;
          }

          await authClient.signIn.email({
            email,
            password,
            rememberMe: remember,
            callbackURL: "/feedback",
          });
        }}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
        {...formProps}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Заполните поле",
            },
            {
              type: "email",
              message: "Некорректный ввод",
            },
          ]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            {
              required: true,
              message: "Заполните поле",
            },
          ]}
        >
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="●●●●●●●●●●"
            size="large"
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          {rememberMe ?? (
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                style={{
                  fontSize: "12px",
                }}
              >
                Запомнить меня
              </Checkbox>
            </Form.Item>
          )}
        </div>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout style={layoutStyles}>
      <Row
        justify="center"
        align="middle"
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? renderContent(CardContent, null) : null}
        </Col>
      </Row>
    </Layout>
  );
};
