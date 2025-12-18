import { registerUser } from '../auth.controller';
import { User } from '../../models/userModel';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { setRefreshTokenCookie } from '../../utils/cookies';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Mocks                                    */
/* -------------------------------------------------------------------------- */

jest.mock('../../models/userModel', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../utils/jwt', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

jest.mock('../../utils/cookies', () => ({
  setRefreshTokenCookie: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

/* -------------------------------------------------------------------------- */
/*                              Test Utilities                                */
/* -------------------------------------------------------------------------- */

const createMockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = (): NextFunction => jest.fn();

/* -------------------------------------------------------------------------- */
/*                               Typed Aliases                                */
/* -------------------------------------------------------------------------- */

const mockFindOne = User.findOne as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;
const mockAccessToken = generateAccessToken as jest.Mock;
const mockRefreshToken = generateRefreshToken as jest.Mock;
const mockSetCookie = setRefreshTokenCookie as jest.Mock;

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe('Auth Controller — registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when input is valid and email is new', () => {
    it('registers user, sets refresh cookie, and returns access token', async () => {
      expect.hasAssertions();

      // Arrange
      const req = {
        body: {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'plain-password',
        },
      } as Request;

      const res = createMockRes();
      const next = createMockNext();

      mockFindOne.mockResolvedValue(null);
      mockHash.mockResolvedValue('hashed-password');
      mockCreate.mockResolvedValue({
        _id: 'user-id-123',
        email: 'john@example.com',
        roles: ['user'],
      });

      mockAccessToken.mockReturnValue('access-token');
      mockRefreshToken.mockReturnValue('refresh-token');

      // Act
      await registerUser(req, res, next);

      // Assert — DB
      expect(mockFindOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          password: 'hashed-password',
          roles: ['user'],
        })
      );

      // Assert — crypto
      expect(mockHash).toHaveBeenCalledWith('plain-password', 12);

      // Assert — tokens
      expect(mockAccessToken).toHaveBeenCalled();
      expect(mockRefreshToken).toHaveBeenCalled();

      // Assert — cookie
      expect(mockSetCookie).toHaveBeenCalledWith(res, 'refresh-token');

      // Assert — response contract
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User registered',
          data: {
            accessToken: 'access-token',
          },
        })
      );

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when email already exists', () => {
    it('throws AppError(400) and stops execution', async () => {
      const req = {
        body: {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password',
        },
      } as Request;

      const res = createMockRes();
      const next = createMockNext();

      mockFindOne.mockResolvedValue({ _id: 'existing-id' });

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockSetCookie).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
