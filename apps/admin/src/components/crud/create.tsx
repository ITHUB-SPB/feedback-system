import React from "react";
import { useRouter } from "@tanstack/react-router";

import Card from "antd/es/card";
import Space from "antd/es/space";
import Spin from "antd/es/spin";

import { PageHeader } from "../page-header";
import { SaveButton, type SaveButtonProps } from "../buttons";
import type { CreateProps } from "./types";

export const Create: React.FC<CreateProps> = ({
  children,
  title,
  resource,
  isLoading = false,
  headerButtons,
  footerButtons,
  saveButtonProps: saveButtonPropsFromProps,
}) => {
  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
    resource,
    htmlType: "submit",
  };

  const router = useRouter();

  return (
    <PageHeader
      onBack={() => router.history.back()}
      title={title ?? "Новая запись"}
      extra={headerButtons ? <Space wrap>{headerButtons}</Space> : null}
    >
      <Spin spinning={isLoading}>
        <Card
          variant="borderless"
          actions={[
            <Space
              key="action-buttons"
              style={{ float: "right", marginRight: 24 }}
            >
              {footerButtons ?? <SaveButton {...saveButtonProps} />}
            </Space>,
          ]}
        >
          {children}
        </Card>
      </Spin>
    </PageHeader>
  );
};
