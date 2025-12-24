import React from "react";
import Typography from "antd/es/typography";
import type { LinkProps } from "antd/es/typography/Link";
import type { RefineFieldCommonProps } from "./_types";

type RefineFieldUrlProps<
  TValueType = string | undefined,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

type UrlFieldProps = RefineFieldUrlProps<string | undefined, LinkProps>;

/**
 * This field lets you embed a link. It uses Ant Design's {@link https://ant.design/components/typography/ `<Typography.Link>`} component.
 * You can pass a URL in its `value` property and you can show a text in its place by passing any `children`.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/url} for more details.
 */
export const UrlField: React.FC<UrlFieldProps> = ({
  children,
  value,
  ...rest
}) => {
  return (
    <Typography.Link href={value} {...rest}>
      {children ?? value}
    </Typography.Link>
  );
};
