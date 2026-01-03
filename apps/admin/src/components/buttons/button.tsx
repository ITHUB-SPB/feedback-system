import React from "react";
import { Button as AntdButton, type ButtonProps } from "antd";

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  hidden,
  ...rest
}) => {
  if (hidden) return null;

  return (
    <AntdButton
      disabled={Boolean(disabled)}
      type="primary"
      onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      {...rest}
    >
      {children}
    </AntdButton>
  );
};
