import { describe, expect, it } from "vitest";

import { roles } from "../../auth/src/permissionControl";

type RoleName = keyof typeof roles;

const actionsOf = (role: RoleName, resource: string): string[] => {
  const r = roles[role] as any;
  return r?.statements?.[resource] ?? [];
};

describe("permissionControl access matrix", () => {
  it("superadmin имеет полный доступ к ключевым ресурсам", () => {
    expect(actionsOf("superadmin", "project")).toContain("delete");
    expect(actionsOf("superadmin", "feedback")).toContain("update");
    expect(actionsOf("superadmin", "administrativeUnit")).toContain("create");
  });

  it("moderator может управлять проектами и голосованием", () => {
    expect(actionsOf("moderator", "project")).toContain("delete");
    expect(actionsOf("moderator", "votingUnit")).toContain("update");
    expect(actionsOf("moderator", "feedback")).toContain("update");
  });

  it("official может видеть и обновлять обращения, но не создавать голоса", () => {
    expect(actionsOf("official", "feedback")).toContain("read");
    expect(actionsOf("official", "feedback")).toContain("update");
    expect(actionsOf("official", "votingVote")).not.toContain("create");
  });

  it("citizen может только просматривать обращения и голоса", () => {
    expect(actionsOf("citizen", "feedback")).toContain("list");
    expect(actionsOf("citizen", "votingVote")).toContain("list");
    expect(actionsOf("citizen", "feedback")).not.toContain("update");
    expect(actionsOf("citizen", "votingVote")).not.toContain("delete");
  });
});