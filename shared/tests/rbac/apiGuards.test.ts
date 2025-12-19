import { describe, expect, test } from "vitest";

const isAuthenticated = (role?: string | null) => Boolean(role);
const isOfficial = (role?: string | null) => isAuthenticated(role);
const isModerator = (role?: string | null) => role === "moderator";

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
    expect(isOfficial(undefined)).toBe(false);
  });

  test("moderator-доступ: только moderator", () => {
    expect(isModerator("moderator")).toBe(true);
    expect(isModerator("official")).toBe(false);
    expect(isModerator("citizen")).toBe(false);
    expect(isModerator(undefined)).toBe(false);
  });
});