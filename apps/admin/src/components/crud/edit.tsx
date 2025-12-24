import React from "react";
import {
  useMutationMode,
  useBack,
  useResourceParams,
  useGo,
  useToPath,
} from "@refinedev/core";

import { ListButton, PageHeader } from "@refinedev/antd";

import { SaveButton } from "../buttons/save";
import { DeleteButton } from "../buttons/delete";
import type {
  ListButtonProps,
  DeleteButtonProps,
  SaveButtonProps,
} from "../buttons/_types";

import Card from "antd/es/card";
import Space from "antd/es/space";
import Spin from "antd/es/spin";

import type { EditProps } from "@refinedev/antd";

export const Edit: React.FC<EditProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  mutationMode: mutationModeProp,
  recordItemId,
  children,
  deleteButtonProps: deleteButtonPropsFromProps,
  canDelete,
  resource: resourceFromProps,
  isLoading = false,
  dataProviderName,
  wrapperProps,
  headerProps,
  contentProps,
  headerButtonProps,
  headerButtons,
  footerButtonProps,
  footerButtons,
  goBack: goBackFromProps,
}) => {
  const { mutationMode: mutationModeContext } = useMutationMode();
  const mutationMode = mutationModeProp ?? mutationModeContext;

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

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: identifier,
      }
    : undefined;

  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: identifier,
        mutationMode,
        onSuccess: () => {
          go({ to: goListPath });
        },
        recordItemId: id,
        dataProviderName,
        ...deleteButtonPropsFromProps,
      }
    : undefined;

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  };

  const defaultHeaderButtons = (
    <>{hasList && <ListButton {...listButtonProps} />}</>
  );

  const defaultFooterButtons = (
    <>
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
      <SaveButton {...saveButtonProps} />
    </>
  );

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        backIcon={goBackFromProps}
        onBack={
          action !== "list" && typeof action !== "undefined" ? back : undefined
        }
        title={title ?? "Редактирование"}
        extra={
          <Space wrap {...(headerButtonProps ?? {})}>
            {headerButtons && typeof headerButtons !== "function"
              ? headerButtons
              : defaultHeaderButtons}
          </Space>
        }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            variant="borderless"
            actions={[
              <Space
                key="footer-buttons"
                wrap
                style={{
                  float: "right",
                  marginRight: 24,
                }}
                {...(footerButtonProps ?? {})}
              >
                {footerButtons
                  ? typeof footerButtons === "function"
                    ? footerButtons({
                        defaultButtons: defaultFooterButtons,
                        deleteButtonProps,
                        saveButtonProps,
                      })
                    : footerButtons
                  : defaultFooterButtons}
              </Space>,
            ]}
            {...(contentProps ?? {})}
          >
            {children}
          </Card>
        </Spin>
      </PageHeader>
    </div>
  );
};
