import React from "react";
import { Button } from "antd";

import type { CreateButtonProps } from "./types";

export const CreateButton: React.FC<CreateButtonProps> = ({
  children,
  onClick,
  disabled,
  hidden,
  ...rest
}) => {
  if (hidden) return null;

  return (
    <Button
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
    </Button>
  );
};
