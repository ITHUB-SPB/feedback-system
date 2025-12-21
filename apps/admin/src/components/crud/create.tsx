import React from "react";
import {
  useTranslate,
  useUserFriendlyName,
  useRefineContext,
  useResourceParams,
  useBack,
} from "@refinedev/core";

import {
  PageHeader,
  type CreateProps
} from "@refinedev/antd";

import Card from 'antd/es/card'
import Space from 'antd/es/space'
import Spin from 'antd/es/spin'

import { Breadcrumb } from "../breadcrumb";
import { SaveButton } from "../buttons/save";
import type { SaveButtonProps } from "../buttons/_types";

/**
 * `<Create>` provides us a layout to display the page.
 * It does not contain any logic but adds extra functionalities like action buttons and giving titles to the page.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/create} for more details.
 */
export const Create: React.FC<CreateProps> = ({
  title,
  saveButtonProps: saveButtonPropsFromProps,
  children,
  resource: resourceFromProps,
  isLoading = false,
  breadcrumb: breadcrumbFromProps,
  wrapperProps,
  headerProps,
  contentProps,
  headerButtonProps,
  headerButtons,
  footerButtonProps,
  footerButtons,
  goBack: goBackFromProps,
}) => {
  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

  const back = useBack();
  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });

  const breadcrumb =
    typeof breadcrumbFromProps === "undefined"
      ? globalBreadcrumb
      : breadcrumbFromProps;

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
        title={
          title ??
          translate(
            `${identifier}.titles.create`,
            `Create ${getUserFriendlyName(
              resource?.meta?.label ?? identifier,
              "singular"
            )}`
          )
        }
        breadcrumb={
          typeof breadcrumb !== "undefined" ? <>{breadcrumb}</> : <Breadcrumb />
        }
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
