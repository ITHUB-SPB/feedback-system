import React, { useState, type CSSProperties } from "react";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";

import { BarsOutlined } from "@ant-design/icons";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import Grid from "antd/es/grid";
import Drawer from "antd/es/drawer";
import Button from "antd/es/button";
import Tabs from "antd/es/tabs";
import theme from "antd/es/theme";
import Typography from "antd/es/typography";

import { authClient } from "@/auth-client";

import { ThemedTitle } from "./title";
import type { RefineThemedLayoutSiderProps } from './types'

import {
  useThemedLayoutContext,
} from "@/core/refine-antd";

const drawerButtonStyles: CSSProperties = {
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
  position: "fixed",
  top: 64,
  zIndex: 999,
};

type TreeMenuItem = {
  key: string,
  name: string,
  icon: React.ReactNode,
  link: string
}

const menuItems = [
  { key: "/feedback", name: "Предложения", icon: null, link: "/feedback" },
  { key: "/projects", name: "Проекты", icon: null, link: "/projects" },
  { key: "/citizens", name: "Респонденты", icon: null, link: "/citizens" },
  { key: "/officials", name: "Администрация", icon: null, link: "/officials" },
  { key: "/topic_category_topics", name: "Категории", icon: null, link: "/topic_category_topics" },
  { key: "/administrative_units", name: "Поселения", icon: null, link: "/administrative_units" },
  { key: "/voting_votes", name: "Результаты", icon: null, link: "/voting_votes" },
  { key: "/voting_units", name: "Участники", icon: null, link: "/voting_units" },
]

export const ThemedSider: React.FC<
  RefineThemedLayoutSiderProps & { user: typeof authClient.$Infer.Session.user }
> = ({
  Title: TitleFromProps,
  fixed,
  activeItemDisabled = false,
  siderItemsAreCollapsed = true,
  user,
}) => {
    const { token } = theme.useToken();

    const redirect = useNavigate();
    const location = useLocation()

    const { mobileSiderOpen, setMobileSiderOpen } = useThemedLayoutContext();

    const breakpoint = Grid.useBreakpoint();

    const isMobile =
      typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

    const RenderToTitle = TitleFromProps ?? ThemedTitle;

    const handleLogout = async () => {
      const confirm = window.confirm(
        "Уверены, что хотите выйти из системы?",
      );

      if (confirm) {
        await authClient.signOut();
        redirect({ to: "/login", search: { redirect: "feedback" } });
      }
    };

    const logout = user.name && (
      <div style={{ marginTop: "auto" }}>
        <Typography.Paragraph strong style={{ textAlign: "center" }}>
          {user.name}
        </Typography.Paragraph>
        <Menu.Item
          key="logout"
          onClick={handleLogout}
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

    const MenuFeedback = () => {
      const linkStyle: React.CSSProperties =
        activeItemDisabled ? { pointerEvents: "none" } : {};

      return (
        <Menu
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[...defaultExpandMenuItems]}
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
          <Menu.Item
            key="/feedback"
            style={linkStyle}
          >
            <Link to="/feedback" style={linkStyle}>Предложения</Link>
          </Menu.Item>
          <Menu.Item
            key="/projects"
            style={linkStyle}
          >
            <Link to="/projects" style={linkStyle}>Проекты</Link>
          </Menu.Item>

          {logout}
        </Menu>
      )
    }

    if (isMobile) {
      return (
        <>
          <Drawer
            open={mobileSiderOpen}
            onClose={() => setMobileSiderOpen(false)}
            placement="left"
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
                  flexDirection: "column",
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
                      children: <MenuFeedback />,
                    },
                    {
                      label: `Голосование`,
                      key: "voting",
                      children: <MenuFeedback />,
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
        <Layout.Sider
          style={{ ...siderStyles, width: "240px" }}
          width={240}
          breakpoint="lg"
        >
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
                children: <MenuFeedback />,
              },
              {
                label: `Голосование`,
                key: "voting",
                children: <MenuFeedback />,
              },
            ]}
          />
        </Layout.Sider>
      </div>
    );
  }