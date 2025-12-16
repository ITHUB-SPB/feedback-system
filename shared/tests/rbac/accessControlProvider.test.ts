import { describe, expect, test } from "vitest";

type Role = "superadmin" | "moderator" | "official" | "citizen" | null;
type Resource = "voting_votes" | "feedback" | "users" | undefined;
type Action = "list" | "show" | "edit" | "delete" | string;

const canByRole = (role: Role, resource: Resource, action: Action): boolean => {
  if (!resource || role === "superadmin") return true;

  if (role === "moderator" && resource !== "users") return true;

  if (role === "official") {
    const permissions: Record<string, string[]> = {
      voting_votes: ["list", "show"],
      feedback: ["list", "edit", "show"],
    };
    return permissions[resource]?.includes(action) ?? false;
  }

  if (role === "citizen") {
    const permissions: Record<string, string[]> = {
      voting_votes: ["list"],
      feedback: ["list"],
    };
    return permissions[resource]?.includes(action) ?? false;
  }

  return false;
};

describe("admin accessControlProvider.can (spec-level)", () => {
  test("citizen cannot edit feedback", () => {
    expect(canByRole("citizen", "feedback", "edit")).toBe(false);
  });

  test("official can edit feedback", () => {
    expect(canByRole("official", "feedback", "edit")).toBe(true);
  });

  test("moderator can delete voting_votes (fallback true)", () => {
    expect(canByRole("moderator", "voting_votes", "delete")).toBe(true);
  });

  test("no resource or superadmin -> always allowed", () => {
    expect(canByRole("superadmin", undefined, "anything")).toBe(true);
    expect(canByRole("superadmin", "users", "delete")).toBe(true);
  });
});