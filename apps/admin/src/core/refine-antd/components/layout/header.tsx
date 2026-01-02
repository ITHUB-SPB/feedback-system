import React from "react";
import { useNavigate } from "@tanstack/react-router";

import Layout from 'antd/es/layout'
import Button from "antd/es/button";
import Space from "antd/es/space";
import theme from "antd/es/theme";
import Typography from "antd/es/typography";

import { authClient } from "@/auth-client";
import { ThemedTitle } from "./title";

export type RefineThemedLayoutHeaderProps = {
  sticky?: boolean;
  user: {
    name: string;
    avatar?: string | undefined | null;
  };
};

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky,
  user,
}) => {
  const { token } = theme.useToken();
  const { data: session } = authClient.useSession();
  const redirect = useNavigate();

  if (!session?.user.name) {
    return null;
  }

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const handleLogout = async () => {
    const confirm = window.confirm(
      "Уверены, что хотите выйти из системы?",
    );

    if (confirm) {
      await authClient.signOut();
      redirect({ to: "/login", search: { redirect: "feedback" } });
    }
  };

  return (
    <Layout.Header style={headerStyles}>
      <ThemedTitle collapsed={false} />
      <Space>
        <Space size="middle">
          {user?.name && <Typography.Text strong>{user.name}</Typography.Text>}
        </Space>
        <Button onClick={handleLogout} style={{ textAlign: "center" }}>
          Выйти
        </Button>
      </Space>
    </Layout.Header>
  );
};

export default ThemedHeader;
