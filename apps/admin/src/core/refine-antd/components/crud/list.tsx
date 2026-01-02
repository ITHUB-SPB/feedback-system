import React from "react";
import Space from "antd/es/space";

import {
  CreateButton,
  type CreateButtonProps,
  PageHeader,
} from "..";
import type { ListProps } from "./types";

/**
 * `<List>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/basic-views/list} for more details.
 */
export const List: React.FC<ListProps> = ({
  canCreate,
  title,
  children,
  createButtonProps: createButtonPropsFromProps,
  resource,
  wrapperProps,
  contentProps,
  headerProps,
  headerButtonProps,
  headerButtons,
}) => {

  const createButtonProps: CreateButtonProps | undefined = canCreate
    ? {
      size: "middle",
      resource,
      ...createButtonPropsFromProps,
    }
    : undefined;

  const defaultExtra = canCreate ? (
    <CreateButton {...createButtonProps} />
  ) : null;

  return (
    <div {...(wrapperProps ?? {})}>
      <PageHeader
        title={title ?? ""}
        extra={
          headerButtons ? (
            <Space wrap {...headerButtonProps}>
              {typeof headerButtons === "function"
                ? headerButtons({
                  defaultButtons: defaultExtra,
                  createButtonProps,
                })
                : headerButtons}
            </Space>
          ) : (
            defaultExtra
          )
        }
        {...(headerProps ?? {})}
      >
        <div {...(contentProps ?? {})}>{children}</div>
      </PageHeader>
    </div>
  );
};
