import React from "react";
import { useExportButton } from "@refinedev/core";
import { ExportOutlined } from "@ant-design/icons";

import Button from "antd/es/button";
import type { ExportButtonProps } from "./_types";
import { RefineButtonClassNames } from "./_enums";

/**
 * `<ExportButton>` is an Ant Design {@link https://ant.design/components/button/ `<Button>`} with a default export icon and a default text with "Export".
 * It only has presentational value.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/buttons/export-button} for more details.
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  hideText = false,
  children,
  ...rest
}) => {
  const { label } = useExportButton();

  return (
    <Button
      type="default"
      icon={<ExportOutlined />}
      className={RefineButtonClassNames.ExportButton}
      {...rest}
    >
      {!hideText && (children ?? label)}
    </Button>
  );
};
