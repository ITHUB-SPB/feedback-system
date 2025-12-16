import { describe, expect, it } from "vitest";

import { ac, roles } from "../../auth/src/permissionControl";

const can = (role: (typeof roles)[keyof typeof roles]) =>
  (ac as any).can(role);

describe("permissionControl access matrix", () => {
  it("superadmin имеет полный доступ к ключевым ресурсам", () => {
    expect(can(roles.superadmin).project("delete")).toBe(true);
    expect(can(roles.superadmin).feedback("update")).toBe(true);
    expect(can(roles.superadmin).administrativeUnit("create")).toBe(true);
  });

  it("moderator может управлять проектами и голосованием", () => {
    expect(can(roles.moderator).project("delete")).toBe(true);
    expect(can(roles.moderator).votingUnit("update")).toBe(true);
    expect(can(roles.moderator).feedback("update")).toBe(true);
  });

  it("official может видеть и обновлять обращения, но не создавать голоса", () => {
    expect(can(roles.official).feedback("read")).toBe(true);
    expect(can(roles.official).feedback("update")).toBe(true);
    expect(can(roles.official).votingVote("create")).toBe(false);
  });

  it("citizen может только просматривать обращения и голоса", () => {
    expect(can(roles.citizen).feedback("list")).toBe(true);
    expect(can(roles.citizen).votingVote("list")).toBe(true);
    expect(can(roles.citizen).feedback("update")).toBe(false);
    expect(can(roles.citizen).votingVote("delete")).toBe(false);
  });
});