import React from "react";
import { useRouter } from "@tanstack/react-router";

import Card from "antd/es/card";
import Space from "antd/es/space";
import Spin from "antd/es/spin";

import type { ShowProps } from "./types";
import { PageHeader } from "../pageHeader";
import { EditButton, DeleteButton, type EditButtonProps, type DeleteButtonProps } from "../buttons";

export const Show: React.FC<ShowProps> = ({
  title,
  canEdit,
  canDelete,
  isLoading = false,
  children,
  resource,
  recordItemId,
  dataProviderName,
  headerButtons,
  footerButtons,
  deleteButtonProps: deleteButtonPropsFromProps,
}) => {
  const router = useRouter();

  const editButtonProps: EditButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    type: "primary",
    resource,
    recordItemId,
  };

  const deleteButtonProps: DeleteButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    resource,
    recordItemId,
    onSuccess: () => {
      router.navigate({ to: `/${resource}` });
    },
    dataProviderName,
    ...deleteButtonPropsFromProps,
  };

  const defaultHeaderButtons = (
    <>
      {canEdit && <EditButton {...editButtonProps}>Редактировать</EditButton>}
      {canDelete && <DeleteButton {...deleteButtonProps} />}
    </>
  );

  return (
    <PageHeader
      onBack={() => {
        router.history.back();
      }}
      title={title ?? ""}
      extra={
        <Space key="extra-buttons" wrap>
          {headerButtons ?? defaultHeaderButtons}
        </Space>
      }
    >
      <Spin spinning={isLoading}>
        <Card variant="borderless">
          {children}
          {footerButtons}
        </Card>
      </Spin>
    </PageHeader>
  );
};
