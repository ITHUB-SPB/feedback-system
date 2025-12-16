import { describe, expect, test } from "vitest";

const isAuthenticated = (role?: string | null) => Boolean(role);
const isOfficial = (role?: string | null) => isAuthenticated(role);
const isModerator = (role?: string | null) =>
  role === "superadmin" || role === "moderator";
const isSuperadmin = (role?: string | null) => role === "superadmin";

describe("API guards role rules (spec-level)", () => {
  test("protected route требует наличие пользователя", () => {
    expect(isAuthenticated("citizen")).toBe(true);
    expect(isAuthenticated("moderator")).toBe(true);
    expect(isAuthenticated(undefined)).toBe(false);
    expect(isAuthenticated(null)).toBe(false);
  });

  test("official-доступ: любая авторизованная роль", () => {
    expect(isOfficial("official")).toBe(true);
    expect(isOfficial("moderator")).toBe(true);
    expect(isOfficial("superadmin")).toBe(true);
    expect(isOfficial(undefined)).toBe(false);
  });

  test("moderator-доступ: только moderator и superadmin", () => {
    expect(isModerator("moderator")).toBe(true);
    expect(isModerator("superadmin")).toBe(true);
    expect(isModerator("official")).toBe(false);
    expect(isModerator("citizen")).toBe(false);
    expect(isModerator(undefined)).toBe(false);
  });

  test("superadmin-доступ: только superadmin", () => {
    expect(isSuperadmin("superadmin")).toBe(true);
    expect(isSuperadmin("moderator")).toBe(false);
    expect(isSuperadmin("official")).toBe(false);
    expect(isSuperadmin("citizen")).toBe(false);
    expect(isSuperadmin(undefined)).toBe(false);
  });
});