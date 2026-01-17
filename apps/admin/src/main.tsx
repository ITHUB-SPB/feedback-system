import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

import { NotFound } from "@/components/not-found";
import { authClient } from "@/providers/auth-client";
import { orpcClient } from "@/providers/orpc-client";
import { queryClient } from "@/providers/data-provider";

import "./index.css";

const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
    authClient: authClient,
    orpcClient: orpcClient,
  },
  Wrap: ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
  defaultPreload: "intent",
  defaultNotFoundComponent: () => {
    return <NotFound />;
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
