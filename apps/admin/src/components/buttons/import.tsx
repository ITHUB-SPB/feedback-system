import React from "react";
import { useImportButton } from "@refinedev/core";
import { ImportOutlined } from "@ant-design/icons";

import Upload from "antd/es/upload";
import Button from "antd/es/button";
import type { ImportButtonProps } from "./_types";
import { RefineButtonClassNames } from "./_enums";

/**
 * `<ImportButton>` is compatible with the {@link https://refine.dev/docs/api-reference/antd/hooks/import/useImport `useImport`} hook and is meant to be used as it's upload button.
 * It uses Ant Design's {@link https://ant.design/components/button/ `<Button>`} and {@link https://ant.design/components/upload/ `<Upload>`} components.
 * It wraps a `<Button>` component with an `<Upload>` component and accepts properties for `<Button>` and `<Upload>` components separately.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/buttons/import-button} for more details.
 */
export const ImportButton: React.FC<ImportButtonProps> = ({
  uploadProps,
  buttonProps,
  hideText = false,
  children,
  loading,
  ...rest
}) => {
  const { label } = useImportButton();

  return (
    <Upload {...uploadProps}>
      <Button
        icon={<ImportOutlined />}
        className={RefineButtonClassNames.ImportButton}
        loading={loading}
        {...buttonProps}
        {...rest}
      >
        {!hideText && (children ?? label)}
      </Button>
    </Upload>
  );
};
