import React from "react";

import Card from "antd/es/card";
import Space from "antd/es/space";
import Spin from "antd/es/spin";

import { useNavigate, useRouter } from "@tanstack/react-router";


import {
  EditButton,
  DeleteButton,
  ListButton,
  PageHeader,
  type ListButtonProps,
  type EditButtonProps,
  type DeleteButtonProps,
} from "..";
import type { ShowProps } from "./types";

/**
 * `<Show>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/show} for more details.
 */
export const Show: React.FC<ShowProps> = ({
  title,
  canEdit,
  canDelete,
  deleteButtonProps: deleteButtonPropsFromProps,
  isLoading = false,
  children,
  resource,
  recordItemId,
  dataProviderName,
  contentProps,
  headerProps,
  wrapperProps,
  headerButtons,
  footerButtons,
}) => {
  const navigate = useNavigate()
  const router = useRouter()

  const editButtonProps: EditButtonProps | undefined = canEdit
    ? {
      ...(isLoading ? { disabled: true } : {}),
      type: "primary",
      resource,
      recordItemId,
    }
    : undefined;

  const deleteButtonProps: DeleteButtonProps | undefined = canDelete
    ? {
      ...(isLoading ? { disabled: true } : {}),
      resource,
      recordItemId,
      onSuccess: () => {
        // navigate({ to: goListPath });
      },
      dataProviderName,
      ...deleteButtonPropsFromProps,
    }
    : undefined;

  const defaultHeaderButtons = (
    <>
      {<ListButton {...listButtonProps} />}
      {canEdit && <EditButton {...editButtonProps} />}
      {canDelete && <DeleteButton {...deleteButtonProps} />}
    </>
  );

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        onBack={() => {
          router.history.back()
        }}
        title={title ?? ""}
        extra={
          <Space key="extra-buttons" wrap>
            {headerButtons ?? defaultHeaderButtons}
          </Space>
        }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            variant="borderless"
            {...(contentProps ?? {})}
          >
            {children}
            {footerButtons}
          </Card>
        </Spin>
      </PageHeader>
    </div>
  );
};
