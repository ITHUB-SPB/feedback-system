import React, { useContext, type CSSProperties } from "react";
import {
  type TreeMenuItem,
  useLogout,
  useIsExistAuthentication,
  useMenu,
  useLink,
  useWarnAboutChange,
  useGetIdentity,
} from "@refinedev/core";
import { ThemedTitle, useThemedLayoutContext, type RefineThemedLayoutSiderProps } from "@refinedev/antd";
import { BarsOutlined } from "@ant-design/icons";

import Layout from 'antd/es/layout'
import Menu from 'antd/es/menu'
import Grid from 'antd/es/grid'
import Drawer from 'antd/es/drawer'
import Button from 'antd/es/button'
import Tabs from 'antd/es/tabs'
import theme from 'antd/es/theme'
import ConfigProvider from 'antd/es/config-provider'
import Typography from "antd/es/typography";


const drawerButtonStyles: CSSProperties = {
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
  position: "fixed",
  top: 64,
  zIndex: 999,
};

export const ThemedSider: React.FC<RefineThemedLayoutSiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed,
  activeItemDisabled = false,
  siderItemsAreCollapsed = true,
}) => {
  const { token } = theme.useToken();
  const { data: user } = useGetIdentity();

  const { mobileSiderOpen, setMobileSiderOpen } = useThemedLayoutContext();

  const isExistAuthentication = useIsExistAuthentication();
  const direction = useContext(ConfigProvider.ConfigContext)?.direction;
  const Link = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { mutate: mutateLogout } = useLogout();

  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? ThemedTitle;

  const renderTreeView = (tree: TreeMenuItem[], selectedKey?: string) => {
    return tree.map((item: TreeMenuItem) => {
      const { key, name, children, meta, list } = item;
      const parentName = meta?.parent;
      const label = item?.label ?? meta?.label ?? name;
      const icon = meta?.icon;
      const route = list;

      const isSelected = key === selectedKey;
      const isRoute = !(parentName !== undefined && children.length === 0);

      const linkStyle: React.CSSProperties =
        activeItemDisabled && isSelected ? { pointerEvents: "none" } : {};

      return (
        <Menu.Item
          key={item.key}
          icon={icon ?? (isRoute && null)}
          style={linkStyle}
        >
          <Link to={route ?? ""} style={linkStyle}>
            {label}
          </Link>
          {isSelected && <div className="ant-menu-tree-arrow" />}
        </Menu.Item>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        "Уверены, что хотите выйти из системы? Несохраненные изменения будут утеряны",
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <div style={{ marginTop: "auto" }}>
      {user?.name && (
        <Typography.Paragraph strong style={{ textAlign: "center" }}>
          {user.name}
        </Typography.Paragraph>
      )}
      <Menu.Item
        key="logout"
        onClick={() => handleLogout()}
        style={{ textAlign: "center" }}
      >
        Выйти
      </Menu.Item>
    </div>
  );

  const defaultExpandMenuItems = (() => {
    if (siderItemsAreCollapsed) return [];

    return menuItems.map(({ key }) => key);
  })();

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = (availableItems: string[]) => {
    const itemsToRender = items.filter(item => availableItems.includes(item.key))
    if (render) {
      return render({
        items: itemsToRender,
        logout,
        collapsed: false,
      });
    }
    return [...itemsToRender, logout].filter(Boolean);
  };

  const renderMenu = (tab: "feedback" | "voting") => {
    const tabsMapping = {
      voting: ["/voting_votes", "/voting_regions", "/citizens"],
      feedback: ["/feedback", "/projects", "/topic_category_topics", "/officials", "/administrative_units", "/citizens"]
    } as const;

    return (
      <>
        <Menu
          selectedKeys={selectedKey ? [selectedKey] : []}
          defaultOpenKeys={[...defaultOpenKeys, ...defaultExpandMenuItems]}
          mode="inline"
          style={{
            paddingTop: "8px",
            border: "none",
            overflow: "auto",
            height: "calc(100dvh - 130px)",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => {
            setMobileSiderOpen(false);
          }}
        >
          {renderSider(tabsMapping[tab])}
        </Menu>
      </>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement={direction === "rtl" ? "right" : "left"}
          closable={false}
          width={200}
          styles={{
            body: {
              padding: 0,
            },
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                height: "100vh",
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  width: "200px",
                  padding: "0 16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "64px",
                  backgroundColor: token.colorBgElevated,
                }}
              >
                <RenderToTitle collapsed={false} />
              </div>

              <Tabs
                defaultActiveKey="feedback"
                centered
                items={[
                  {
                    label: `Предложения`,
                    key: "feedback",
                    children: renderMenu("feedback")
                  },
                  {
                    label: `Голосование`,
                    key: "voting",
                    children: renderMenu("voting")
                  },
                ]}
              />
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setMobileSiderOpen(true)}
          icon={<BarsOutlined />}
        />
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.height = "100vh";
    siderStyles.zIndex = 999;
  }

  return (
    <div style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)" }}>
      {fixed && (
        <div
          style={{
            width: "240px",
            transition: "all 0.2s",
          }}
        />
      )}
      <Layout.Sider style={{ ...siderStyles, width: "240px" }} width={240} breakpoint="lg">
        <div
          style={{
            width: "240px",
            padding: "0 16px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor: token.colorBgElevated,
            fontSize: "14px",
          }}
        >
          <RenderToTitle collapsed={false} />
        </div>
        <Tabs
          defaultActiveKey="feedback"
          centered
          size="small"
          tabBarGutter={20}
          items={[
            {
              label: `Предложения`,
              key: "feedback",
              children: renderMenu("feedback")
            },
            {
              label: `Голосование`,
              key: "voting",
              children: renderMenu("voting")
            },
          ]}
        />
      </Layout.Sider>
    </div>
  );
};
