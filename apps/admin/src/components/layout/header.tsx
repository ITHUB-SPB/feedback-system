import React from "react";
import { Layout as AntdLayout, Avatar } from "antd";

import Button from 'antd/es/button'
import Space from 'antd/es/space'
import theme from 'antd/es/theme'
import Typography from "antd/es/typography";

import {
  useLogout, useWarnAboutChange
} from "@refinedev/core";

import { ThemedTitle } from "../../components/layout/title";


export type RefineThemedLayoutHeaderProps = {
  sticky?: boolean;
  user: {
    name: string,
    avatar?: string | undefined | null
  }
};


export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky,
  user,
}) => {
  const { token } = theme.useToken();
  const { mutate: mutateLogout } = useLogout();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();

  if (!user.name) {
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

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        "Уверены, что хотите выйти из системы? Несохраненные изменения будут утеряны",
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  return (
    <AntdLayout.Header style={headerStyles}>
      <ThemedTitle collapsed={false} />
      <Space>
        <Space size="middle">
          {user?.name && <Typography.Text strong>{user.name}</Typography.Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
        <Button onClick={handleLogout} style={{ textAlign: "center" }}>Выйти</Button>
      </Space>
    </AntdLayout.Header>
  );
};

export default ThemedHeader