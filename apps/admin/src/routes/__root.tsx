import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";

import { Refine } from "@refinedev/core";

import AntdApp from "antd/es/app";
import ConfigProvider from "antd/es/config-provider";

import { useNotificationProvider } from "@refinedev/antd";

import "antd/dist/reset.css";

import { authClient } from "../auth-client";
import { dataProvider } from "../providers/data-provider";
import { routerProvider } from "../providers/router-provider";
import { resources } from "../resources";

interface RouterContext {
  queryClient: QueryClient;
  authClient: typeof authClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
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
