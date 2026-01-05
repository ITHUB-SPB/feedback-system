import React, { type ReactNode, useState, useContext } from "react";


export interface IThemedLayoutContext {
  siderCollapsed: boolean;
  setSiderCollapsed: (visible: boolean) => void;
  mobileSiderOpen: boolean;
  setMobileSiderOpen: (visible: boolean) => void;
  onSiderCollapsed?: (collapsed: boolean) => void;
}

export const ThemedLayoutContext = React.createContext<IThemedLayoutContext>({
  siderCollapsed: false,
  mobileSiderOpen: false,
  setSiderCollapsed: () => undefined,
  setMobileSiderOpen: () => undefined,
});

export const ThemedLayoutContextProvider: React.FC<{
  children: ReactNode;
  initialSiderCollapsed?: boolean;
  onSiderCollapsed?: (collapsed: boolean) => void;
}> = ({ children, initialSiderCollapsed, onSiderCollapsed }) => {
  const [siderCollapsed, setSiderCollapsedState] = useState(
    initialSiderCollapsed ?? false,
  );
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false);

  const setSiderCollapsed = (collapsed: boolean) => {
    setSiderCollapsedState(collapsed);
    if (onSiderCollapsed) {
      onSiderCollapsed(collapsed);
    }
  };

  return (
    <ThemedLayoutContext.Provider
      value={{
        siderCollapsed,
        mobileSiderOpen,
        setSiderCollapsed,
        setMobileSiderOpen,
      }}
    >
      {children}
    </ThemedLayoutContext.Provider>
  );
};

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

