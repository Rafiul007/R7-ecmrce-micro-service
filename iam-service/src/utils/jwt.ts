import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiresIn = process.env.ACCES_TOKEN_EXPIRATION;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error('JWT secrets are not defined in .env file');
}

/**
 * JWT Payload Interface
 */
export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
  employeeType?: string;
  customerType?: string;
}

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: ITokenPayload): string => {
  const options: SignOptions = {
    expiresIn: accessTokenExpiresIn as SignOptions['expiresIn']
  };
  return jwt.sign(payload, accessTokenSecret as string, options);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: ITokenPayload): string => {
  const options: SignOptions = {
    expiresIn: refreshTokenExpiresIn as SignOptions['expiresIn']
  };
  return jwt.sign(payload, refreshTokenSecret as string, options);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, accessTokenSecret as string) as ITokenPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, refreshTokenSecret as string) as ITokenPayload;
};
