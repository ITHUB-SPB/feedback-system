import React from "react";
import type { LinkProps } from "antd/lib/typography/Link";
import { UrlField } from "./url";

type RefineFieldFileProps<
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = TComponentProps &
  TExtraProps & {
    /**
     * Used for file title
     * @default The `src` property
     */
    title?: string;
    /**
     * Used for file path
     */
    src: string;
  };

type FileFieldProps = RefineFieldFileProps<LinkProps>;

/**
 * This field is used to display files and uses {@link https://ant.design/components/typography `<Typography.Link>`} from Ant Design.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/file} for more details.
 */
export const FileField: React.FC<FileFieldProps> = ({
  title,
  src,
  ...rest
}) => {
  return (
    <UrlField value={src} title={title} {...rest}>
      {title ?? src}
    </UrlField>
  );
};
