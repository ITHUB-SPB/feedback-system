import React from "react";
import { ThemedLayoutContextProvider, type RefineThemedLayoutProps } from "@refinedev/antd";
import Grid from 'antd/es/grid'
import AntdLayout from 'antd/es/layout'

import { ThemedSider as DefaultSider } from "./sider";

export const ThemedLayout: React.FC<RefineThemedLayoutProps> = ({
  children,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
  onSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;

  return (
    <ThemedLayoutContextProvider
      initialSiderCollapsed={initialSiderCollapsed}
      onSiderCollapsed={onSiderCollapsed}
    >
      <AntdLayout style={{ minHeight: "100vh" }} hasSider={true}>
        <SiderToRender Title={Title} />
        <AntdLayout>
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
