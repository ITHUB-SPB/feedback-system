import React from "react";
import { useRefreshButton } from "@refinedev/core";
import { RedoOutlined } from "@ant-design/icons";

import Button from "antd/es/button";
import type { RefreshButtonProps } from "./_types";
import { RefineButtonClassNames } from "./_enums";

/**
 * `<RefreshButton>` uses Ant Design's {@link https://ant.design/components/button/ `<Button>`} component
 * to update the data shown on the page via the {@link https://refine.dev/docs/api-reference/core/hooks/invalidate/useInvalidate `useInvalidate`} hook.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/buttons/refresh-button} for more details.
 */
export const RefreshButton: React.FC<RefreshButtonProps> = ({
  resource: resourceNameFromProps,
  recordItemId,
  hideText = false,
  dataProviderName,
  children,
  ...rest
}) => {
  const { onClick, label, loading } = useRefreshButton({
    resource: resourceNameFromProps,
    id: recordItemId,
    dataProviderName,
  });

  return (
    <Button
      onClick={onClick}
      icon={<RedoOutlined spin={loading} />}
      className={RefineButtonClassNames.RefreshButton}
      {...rest}
    >
      {!hideText && (children ?? label)}
    </Button>
  );
};
