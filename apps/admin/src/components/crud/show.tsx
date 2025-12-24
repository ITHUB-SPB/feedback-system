import React from "react";
import { useResourceParams, useToPath, useBack, useGo } from "@refinedev/core";

import { ListButton, PageHeader, type ShowProps } from "@refinedev/antd";

import Card from "antd/es/card";
import Space from "antd/es/space";
import Spin from "antd/es/spin";

import { EditButton } from "../buttons/edit";
import { DeleteButton } from "../buttons/delete";
import type {
  ListButtonProps,
  EditButtonProps,
  DeleteButtonProps,
} from "../buttons/_types";

export const Show: React.FC<ShowProps> = ({
  title,
  canEdit,
  canDelete,
  deleteButtonProps: deleteButtonPropsFromProps,
  isLoading = false,
  children,
  resource: resourceFromProps,
  recordItemId,
  dataProviderName,
  contentProps,
  headerProps,
  wrapperProps,
  headerButtons,
  footerButtons,
  footerButtonProps,
  headerButtonProps,
  goBack: goBackFromProps,
}) => {
  const back = useBack();
  const go = useGo();

  const {
    resource,
    action,
    id: idFromParams,
    identifier,
  } = useResourceParams({
    resource: resourceFromProps,
  });

  const goListPath = useToPath({
    resource,
    action: "list",
  });

  const id = recordItemId ?? idFromParams;

  const hasList = resource?.list && !recordItemId;

  const isDeleteButtonVisible =
    canDelete ?? (resource?.meta?.canDelete || deleteButtonPropsFromProps);

  const isEditButtonVisible = canEdit ?? !!resource?.edit;

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        resource: identifier,
      }
    : undefined;

  const editButtonProps: EditButtonProps | undefined = isEditButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        type: "primary",
        resource: identifier,
        recordItemId: id,
      }
    : undefined;

  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: identifier,
        recordItemId: id,
        onSuccess: () => {
          go({ to: goListPath });
        },
        dataProviderName,
        ...deleteButtonPropsFromProps,
      }
    : undefined;

  const defaultHeaderButtons = (
    <>
      {hasList && <ListButton {...listButtonProps} />}
      {isEditButtonVisible && <EditButton {...editButtonProps} />}
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
    </>
  );

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        backIcon={goBackFromProps}
        onBack={
          action !== "list" && typeof action !== "undefined" ? back : undefined
        }
        title={title ?? ""}
        extra={
          <Space key="extra-buttons" wrap {...(headerButtonProps ?? {})}>
            {headerButtons
              ? typeof headerButtons === "function"
                ? headerButtons({
                    defaultButtons: defaultHeaderButtons,
                    deleteButtonProps,
                    editButtonProps,
                    listButtonProps,
                    refreshButtonProps: undefined,
                  })
                : headerButtons
              : defaultHeaderButtons}
          </Space>
        }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            variant="borderless"
            actions={
              footerButtons
                ? [
                    <Space key="footer-buttons" wrap {...footerButtonProps}>
                      {typeof footerButtons === "function"
                        ? footerButtons({
                            defaultButtons: null,
                          })
                        : footerButtons}
                    </Space>,
                  ]
                : undefined
            }
            {...(contentProps ?? {})}
          >
            {children}
          </Card>
        </Spin>
      </PageHeader>
    </div>
  );
};
