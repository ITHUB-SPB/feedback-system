import React from "react";
import Grid from "antd/es/grid";
import AntdLayout from "antd/es/layout";

import {
  ThemedLayoutContextProvider,
} from "@/core/refine-antd";

import {
  type RefineThemedLayoutProps
} from "./types"

export { ThemedHeader } from "./header";
export { ThemedSider } from './sider'
export { ThemedTitle } from './title'

export const ThemedLayout: React.FC<RefineThemedLayoutProps> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
  onSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? null;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;

  return (
    <ThemedLayoutContextProvider
      initialSiderCollapsed={initialSiderCollapsed}
      onSiderCollapsed={onSiderCollapsed}
    >
      <AntdLayout style={{ minHeight: "100vh" }} hasSider={true}>
        {SiderToRender ? <SiderToRender Title={Title} /> : null}
        <AntdLayout>
          {Header && <Header />}
          <AntdLayout.Content>
            <div
              style={{
                minHeight: 360,
                padding: isSmall ? 24 : 12,
              }}
            >
              {children}
            </div>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
