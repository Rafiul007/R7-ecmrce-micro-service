import { Response, Request } from 'express';

const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME;
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS);
const REFRESH_TOKEN_COOKIE_SAME_SITE = process.env.REFRESH_TOKEN_COOKIE_SAME_SITE;
const REFRESH_TOKEN_COOKIE_SECURE = process.env.REFRESH_TOKEN_COOKIE_SECURE === 'true';

if (!REFRESH_TOKEN_COOKIE_NAME) {
  throw new Error('REFRESH_TOKEN_COOKIE_NAME is not defined in environment variables');
}

if (!Number.isFinite(REFRESH_TOKEN_COOKIE_MAX_AGE_MS) || REFRESH_TOKEN_COOKIE_MAX_AGE_MS <= 0) {
  throw new Error('REFRESH_TOKEN_COOKIE_MAX_AGE_MS must be a positive number');
}

if (!['strict', 'lax', 'none'].includes(String(REFRESH_TOKEN_COOKIE_SAME_SITE))) {
  throw new Error('REFRESH_TOKEN_COOKIE_SAME_SITE must be one of: strict, lax, none');
}

if (REFRESH_TOKEN_COOKIE_SAME_SITE === 'none' && !REFRESH_TOKEN_COOKIE_SECURE) {
  throw new Error(
    'REFRESH_TOKEN_COOKIE_SECURE must be true when REFRESH_TOKEN_COOKIE_SAME_SITE is none'
  );
}

const parseCookieHeader = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (!rawName) return cookies;

    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: REFRESH_TOKEN_COOKIE_SECURE,
    sameSite: REFRESH_TOKEN_COOKIE_SAME_SITE as 'strict' | 'lax' | 'none',
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: REFRESH_TOKEN_COOKIE_SECURE,
    sameSite: REFRESH_TOKEN_COOKIE_SAME_SITE as 'strict' | 'lax' | 'none'
  });
};

export const getRefreshTokenFromCookie = (req: Request): string | undefined => {
  const parsedCookies = parseCookieHeader(req.headers.cookie);

  return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || parsedCookies[REFRESH_TOKEN_COOKIE_NAME];
};
