import { Request, Response } from 'express';

const REFRESH_TOKEN_EXPIRATION_DAYS = 14;

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};
type RequestWithCookies = Request & { cookies?: Record<string, string> };

export const getRefreshTokenFromCookie = (req: RequestWithCookies): string | undefined => {
  return req.cookies?.refreshToken;
};
