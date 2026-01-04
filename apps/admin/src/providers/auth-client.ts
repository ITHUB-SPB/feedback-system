import { getAuthClient } from "@shared/auth/client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL!;

export const authClient = getAuthClient(apiBaseUrl);
export type AuthClient = typeof authClient;
