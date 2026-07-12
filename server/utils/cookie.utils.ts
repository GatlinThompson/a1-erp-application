import type { Response } from "express";

export const AUTH_COOKIE_NAME = "token";

// Keep in sync with JWT_EXPIRES_IN in .env (that controls the token's own
// expiry; this just controls how long the browser holds onto the cookie).
const AUTH_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};
