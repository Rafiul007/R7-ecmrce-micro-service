import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiresIn = process.env.ACCES_TOKEN_EXPIRATION;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error('JWT secrets are not defined in .env file');
}

export interface ITokenPayload {
  role: string;
  id: string;
  email: string;
}

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: ITokenPayload): string => {
  const options: SignOptions = { expiresIn: accessTokenExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, accessTokenSecret, options);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: ITokenPayload): string => {
  const options: SignOptions = { expiresIn: refreshTokenExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, refreshTokenSecret, options);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, accessTokenSecret) as ITokenPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, refreshTokenSecret) as ITokenPayload;
};
