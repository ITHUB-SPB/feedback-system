import { Refine } from "@refinedev/core";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, createRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";

import AntdApp from "antd/es/app";
import ConfigProvider from "antd/es/config-provider";
import { useTranslation } from "react-i18next";

import { useNotificationProvider } from "@refinedev/antd";

import "../i18n";

import "antd/dist/reset.css";

// import { Route as tasksRoute } from "./tasks";
// import { Route as slotsRoute } from "./slots";

import { authClient } from '../auth-client';
import { dataProvider } from "../providers/data-provider";
import { authProvider } from "../providers/auth-provider";
import { accessControlProvider } from "../providers/access-control-provider";
import { routerProvider } from '../providers/router-provider'
import { resources } from "../resources";

interface RouterContext {
  queryClient: QueryClient
  authClient: typeof authClient
}

interface I18nProvider {
  translate: (key: string, params?: any) => string;
  changeLocale: (lang: string) => void;
  getLocale: () => string;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const { t } = useTranslation();

    const i18nProvider: I18nProvider = {
      translate: (key: string, params?: any) => {
        return String(t(key, params));
      },
      changeLocale: (_: string) => { },
      getLocale: () => {
        return "ru";
      },
    };

    return (
      // <DevtoolsProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677FF",
            fontFamily: "MuseoSansCyrl",
          },
        }}
      >
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            accessControlProvider={accessControlProvider}
            notificationProvider={useNotificationProvider}
            i18nProvider={i18nProvider}
            resources={resources}
          // options={
          //   {
          //     reactQuery: {
          //       clientConfig: queryClient
          //     }
          //   }
          // }
          >
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            {/* <DevtoolsPanel /> */}
          </Refine>
        </AntdApp>
      </ConfigProvider>
      // </DevtoolsProvider>
    );
  },
});