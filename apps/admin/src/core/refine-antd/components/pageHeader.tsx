import React from "react";
import {
  PageHeader as AntdPageHeader,
  type PageHeaderProps as AntdPageHeaderProps,
} from "@ant-design/pro-layout";
import Button from 'antd/es/button'
import Typography from "antd/es/typography";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { RefinePageHeaderClassNames } from "@/core/refine-types";

export type PageHeaderProps = AntdPageHeaderProps;

export const PageHeader: React.FC<AntdPageHeaderProps> = ({ children, ...props }) => {
  const title =
    typeof props.title === "string" ? (
      <Typography.Title
        className={RefinePageHeaderClassNames.Title}
        level={4}
        style={{ marginBottom: 0 }}
      >
        {props.title}
      </Typography.Title>
    ) : (
      props.title
    );

  const subtitle =
    typeof props.title === "string" ? (
      <Typography.Title
        className={RefinePageHeaderClassNames.SubTitle}
        level={5}
        type="secondary"
        style={{ marginBottom: 0 }}
      >
        {props.subTitle}
      </Typography.Title>
    ) : (
      props.subTitle
    );

  return (
    <AntdPageHeader
      {...props}
      backIcon={<Button type="text" icon={<ArrowLeftOutlined />} />}
      title={title}
      subTitle={subtitle}
      style={{ padding: 0, ...props.style }}
    >
      {children}
    </AntdPageHeader>
  );
};
