import React from "react";
import { Link } from "@tanstack/react-router";

import Typography from "antd/es/typography";
import theme from "antd/es/theme";
import Space from "antd/es/space";

import type { RefineLayoutThemedTitleProps } from "./types";

export const ThemedTitle: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
}) => {
  const text = "Предложения 47";
  const { token } = theme.useToken();

  return (
    <Link
      to="/"
      style={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >
      <Space
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "inherit",
          ...wrapperStyles,
        }}
      >
        <div
          style={{
            width: "24px",
            color: token.colorPrimary,
          }}
        >
          <img
            src="/logos/logo_2022_black.svg"
            alt="Logo"
            style={{ height: "24px", width: "auto" }}
          />
        </div>

        {!collapsed && (
          <Typography.Title
            style={{
              fontSize: "inherit",
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            {text}
          </Typography.Title>
        )}
      </Space>
    </Link>
  );
};
