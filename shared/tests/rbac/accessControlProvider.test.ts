import { describe, expect, test, vi, beforeEach } from "vitest";
import { accessControlProvider } from "../../../apps/admin/src/providers/access-control-provider";

const mockSession = (role: string | null) =>
  vi
    .spyOn(
      (accessControlProvider as any).constructor.prototype.authClient ?? {},
      "getSession",
    )
    .mockResolvedValue({ data: role ? { user: { role } } : null });

describe("admin accessControlProvider.can", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("citizen cannot edit feedback", async () => {
    mockSession("citizen");
    const res = await accessControlProvider.can({
      resource: "feedback",
      action: "edit",
    });
    expect(res.can).toBe(false);
  });

  test("official can edit feedback", async () => {
    mockSession("official");
    const res = await accessControlProvider.can({
      resource: "feedback",
      action: "edit",
    });
    expect(res.can).toBe(true);
  });

  test("moderator can delete voting_votes (fallback true)", async () => {
    mockSession("moderator");
    const res = await accessControlProvider.can({
      resource: "voting_votes",
      action: "delete",
    });
    expect(res.can).toBe(true);
  });

  test("unauthorized by default when no session", async () => {
    mockSession(null);
    const res = await accessControlProvider.can({
      resource: "feedback",
      action: "edit",
    });
    expect(res.can).toBe(false);
  });
});