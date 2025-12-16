import { describe, expect, test } from "vitest";
import { createApi } from "../../../apps/server/src/api";
import apiRouter from "../../../apps/server/src/router";

const fakeAuth = (role?: string) => ({
  api: {
    getSession: async () =>
      role ? { data: { user: { role } } } : { data: null },
  },
});

const createTestApi = (role?: string) =>
  createApi({
    apiRouter,
    auth: fakeAuth(role) as any,
    db: {} as any,
    environment: {} as any,
    apiPath: "/api",
  });

describe("API guards (role-based procedures)", () => {
  test("official can call protected feedback update handler", async () => {
    const api = createTestApi("official");
    const req = new Request("http://localhost/api/feedback/1", {
      method: "PUT",
      body: "{}",
    });

    const res = await api.handler(req);
    const status =
      res instanceof Response
        ? res.status
        : (res as { response: Response }).response.status;
    expect(status).not.toBe(401);
  });

  test("citizen receives unauthorized on moderator-only routes", async () => {
    const api = createTestApi("citizen");
    const req = new Request("http://localhost/api/voting-unit", {
      method: "POST",
      body: "{}",
    });

    const res = await api.handler(req);
    const status =
      res instanceof Response
        ? res.status
        : (res as { response: Response }).response.status;
    expect([401, 403]).toContain(status);
  });

  test("no session -> unauthorized", async () => {
    const api = createTestApi(undefined);
    const req = new Request("http://localhost/api/feedback/1", {
      method: "PUT",
      body: "{}",
    });

    const res = await api.handler(req);
    const status =
      res instanceof Response
        ? res.status
        : (res as { response: Response }).response.status;
    expect([401, 403]).toContain(status);
  });
});