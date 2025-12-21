import React from "react";
import {
  useResourceParams,
} from "@refinedev/core";
import {
  PageHeader,
} from "@refinedev/antd";
import type { ListProps } from "@refinedev/antd";
import Space from 'antd/es/space'

import { CreateButton } from "../buttons/create";
import type { CreateButtonProps } from "../buttons/_types";


export const List: React.FC<ListProps> = ({
  canCreate,
  title,
  children,
  createButtonProps: createButtonPropsFromProps,
  resource: resourceFromProps,
  wrapperProps,
  contentProps,
  headerProps,
  headerButtonProps,
  headerButtons,
}) => {
  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });

  const isCreateButtonVisible =
    canCreate ?? (!!resource?.create || !!createButtonPropsFromProps);

  const createButtonProps: CreateButtonProps | undefined = isCreateButtonVisible
    ? {
      size: "middle",
      resource: identifier,
      ...createButtonPropsFromProps,
    }
    : undefined;

  const defaultExtra = isCreateButtonVisible ? (
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
