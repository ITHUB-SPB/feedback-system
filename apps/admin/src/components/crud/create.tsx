import React from "react";
import {
  useBack,
} from "@refinedev/core";

import {
  PageHeader,
  type CreateProps
} from "@refinedev/antd";

import Card from 'antd/es/card'
import Space from 'antd/es/space'
import Spin from 'antd/es/spin'

import { SaveButton } from "../buttons/save";
import type { SaveButtonProps } from "../buttons/_types";

export const Create: React.FC<CreateProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  children,
  isLoading = false,
  wrapperProps,
  headerProps,
  contentProps,
  headerButtonProps,
  headerButtons,
  footerButtonProps,
  footerButtons,
  goBack: goBackFromProps,
}) => {
  const back = useBack();

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
    htmlType: "submit",
  };

  const defaultFooterButtons = (
    <>
      <SaveButton {...saveButtonProps} />
    </>
  );

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        backIcon={goBackFromProps}
        onBack={back}
        title={title ?? "Новая запись"}
        extra={
          <Space wrap {...(headerButtonProps ?? {})}>
            {headerButtons
              ? typeof headerButtons === "function"
                ? headerButtons({
                  defaultButtons: null,
                })
                : headerButtons
              : null}
          </Space>
        }
        {...(headerProps ?? {})}
      >
        <Spin spinning={isLoading}>
          <Card
            variant="borderless"
            actions={[
              <Space
                key="action-buttons"
                style={{ float: "right", marginRight: 24 }}
                {...(footerButtonProps ?? {})}
              >
                {footerButtons
                  ? typeof footerButtons === "function"
                    ? footerButtons({
                      defaultButtons: defaultFooterButtons,
                      saveButtonProps: saveButtonProps,
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
