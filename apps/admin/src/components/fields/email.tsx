import React, { type ReactNode } from "react";

import Typography from 'antd/es/typography'
import type { LinkProps } from "antd/lib/typography/Link";

import type { RefineFieldCommonProps } from "./_types";

export type RefineFieldEmailProps<
  TValueType = React.ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

export type EmailFieldProps = RefineFieldEmailProps<ReactNode, LinkProps>;

/**
 * This field is used to display email values. It uses the {@link https://ant.design/components/typography/#FAQ `<Link>`} component
 * of {@link https://ant.design/components/typography `<Typography>`} from Ant Design.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/email} for more details.
 */
export const EmailField: React.FC<EmailFieldProps> = ({ value, ...rest }) => {
  return (
    <Typography.Link href={`mailto:${value}`} {...rest}>
      {value}
    </Typography.Link>
  );
};
