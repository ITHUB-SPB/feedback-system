import React from "react";

import { Card, Space, Spin } from "antd";

import {
  useMutationMode,
} from "@refinedev/core";

import {
  DeleteButton,
  ListButton,
  SaveButton,
  PageHeader,
  type ListButtonProps,
  type DeleteButtonProps,
  type SaveButtonProps,
} from "..";
import type { EditProps } from "./types";

/**
 * `<Edit>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/edit} for more details.
 */
export const Edit: React.FC<EditProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  mutationMode: mutationModeProp,
  recordItemId,
  children,
  deleteButtonProps: deleteButtonPropsFromProps,
  canDelete,
  resource,
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

  const id = recordItemId;

  const deleteButtonProps: DeleteButtonProps | undefined =
  {
    ...(isLoading ? { disabled: true } : {}),
    resource,
    mutationMode,
    onSuccess: () => {
      // go({ to: goListPath });
    },
    recordItemId: id,
    dataProviderName,
    ...deleteButtonPropsFromProps,
  }

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  };

  const defaultHeaderButtons = (
    <>
      {<ListButton {...listButtonProps} />}
    </>
  );

  const defaultFooterButtons = (
    <>
      {<DeleteButton {...deleteButtonProps} />}
      <SaveButton {...saveButtonProps} />
    </>
  );

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        backIcon={goBackFromProps}
        // onBack={back}
        title={title ?? "Редактирование"}
        extra={
          <Space wrap {...(headerButtonProps ?? {})}>
            {headerButtons
              ? typeof headerButtons === "function"
                ? headerButtons({
                  defaultButtons: defaultHeaderButtons,
                  listButtonProps,
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
