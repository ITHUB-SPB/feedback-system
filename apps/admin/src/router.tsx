import { createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { authClient } from "./auth-client";
import { queryClient } from "./providers/data-provider";
import { orpcClient } from "./providers/orpc-provider";

import { routeTree } from "./routeTree.gen";

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
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
