import { useContext } from "react";

import { ThemedLayoutContext } from "../contexts";
import type { IThemedLayoutContext } from "../contexts/themedLayoutContext/IThemedLayoutContext";

export const useThemedLayoutContext = (): IThemedLayoutContext => {
  const {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  } = useContext(ThemedLayoutContext);

  return {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  };
};
