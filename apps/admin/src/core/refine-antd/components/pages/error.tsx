import React, { useEffect, useState } from "react";
import { Button, Result, Typography, Space, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import type { RefineErrorPageProps } from "@/core/refine-types";

/**
 * When the app is navigated to a non-existent route, refine shows a default error page.
 * A custom error component can be used for this error page.
 *
 * @see {@link https://refine.dev/docs/packages/documentation/routers/} for more details.
 */
export const ErrorComponent: React.FC<RefineErrorPageProps> = () => {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <Result
      status="404"
      title="404"
      extra={
        <Space orientation="vertical" size="large">
          <Space>
            <Typography.Text>
              "Sorry, the page you visited does not exist.",
            </Typography.Text>
            {errorMessage && (
              <Tooltip title={errorMessage}>
                <InfoCircleOutlined data-testid="error-component-tooltip" />
              </Tooltip>
            )}
          </Space>
          <Button type="primary"
          // onClick={() => go({ to: "/" })}
          >
            Back Home
          </Button>
        </Space>
      }
    />
  );
};
