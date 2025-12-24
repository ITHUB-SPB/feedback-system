import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";

import { Refine } from "@refinedev/core";

import AntdApp from "antd/es/app";
import ConfigProvider from "antd/es/config-provider";
import { useTranslation } from "react-i18next";

import { useNotificationProvider } from "@refinedev/antd";

import "../i18n";
import "antd/dist/reset.css";

import { authClient } from "../auth-client";
import { dataProvider } from "../providers/data-provider";
import { routerProvider } from "../providers/router-provider";
import { authProvider } from "../providers/auth-provider";
import { resources } from "../resources";

interface RouterContext {
  queryClient: QueryClient;
  authClient: typeof authClient;
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
      changeLocale: (_: string) => {},
      getLocale: () => {
        return "ru";
      },
    };

    return (
      <>
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
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider}
              i18nProvider={i18nProvider}
              resources={resources}
              authProvider={authProvider}
              // options={
              //   {
              //     reactQuery: {
              //       clientConfig: queryClient
              //     }
              //   }
              // }
            >
              <Outlet />
            </Refine>
          </AntdApp>
        </ConfigProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </>
    );
  },
});
