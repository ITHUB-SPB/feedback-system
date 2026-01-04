import React from "react";
import Space from "antd/es/space";

import { CreateButton, type CreateButtonProps } from "../buttons";
import { PageHeader } from "../pageHeader";
import type { ListProps } from "./types";

export const List: React.FC<ListProps> = ({
  children,
  resource,
  title,
  headerButtons,
  canCreate,
  createButtonProps: createButtonPropsFromProps,
}) => {
  const createButtonProps: CreateButtonProps = {
    size: "middle",
    resource,
    ...createButtonPropsFromProps,
  };

  const defaultHeaderButtons = canCreate ? (
    <CreateButton {...createButtonProps} />
  ) : null;

  return (
    <PageHeader
      title={title ?? ""}
      extra={
        headerButtons ? (
          <Space wrap>{headerButtons}</Space>
        ) : (
          defaultHeaderButtons
        )
      }
    >
      {children}
    </PageHeader>
  );
};
