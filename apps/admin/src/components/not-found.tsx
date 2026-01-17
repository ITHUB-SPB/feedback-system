import React from "react";
import { Link } from "@tanstack/react-router";

import Result from "antd/es/result";
import Typography from "antd/es/typography";
import Space from "antd/es/space";
import Tooltip from "antd/es/tooltip";
import { InfoCircleOutlined } from "@ant-design/icons";

export const NotFound: React.FC<{ errorMessage?: string }> = ({
  errorMessage,
}) => (
  <Result
    status="404"
    title="404"
    extra={
      <Space orientation="vertical" size="large">
        <Space>
          <Typography.Text>
            К сожалению, такая страница не найдена
          </Typography.Text>
          {errorMessage && (
            <Tooltip title={errorMessage}>
              <InfoCircleOutlined data-testid="error-component-tooltip" />
            </Tooltip>
          )}
        </Space>
        <Link to="/feedback">Вернуться на главную</Link>
      </Space>
    }
  />
);
