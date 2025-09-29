// import { Request, Response, NextFunction } from 'express';
// import bcrypt from 'bcryptjs';
// import { responseHandler } from '../utils/response-handler';
// import { asyncHandler } from '../utils/async-handler';
// import { User } from '../models/userModel';
// import { AppError } from '../utils/error-handler';
// import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
// import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/cookies';

// /**
//  * Auth Controller
//  * Handles user authentication operations like
//  * sign up, login, logout, and fetching user details.
//  */

// // Get Auth Status
// export const getAuthStatus = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     responseHandler(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Auth service is running',
//       data: {}
//     });
//   }
// );

// //  Sign Up User
// export const signUpUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;

//   const existingUser = await User.findOne({ email });

//   if (existingUser) throw new AppError('User already exists', 400);

//   const hashedPassword = await bcrypt.hash(password, 12);
//   const newUser = await User.create({
//     email,
//     password: hashedPassword
//   });

//   responseHandler(res, {
//     statusCode: 201,
//     success: true,
//     message: 'User created successfully',
//     data: { userId: newUser._id, email: newUser.email }
//   });
// });

// // Login User
// export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) throw new AppError('Invalid email or password', 401);

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

//   const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
//   const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

//   setRefreshTokenCookie(res, refreshToken);

//   responseHandler(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User logged in successfully',
//     data: { accessToken }
//   });
// });

// // Logout User
// export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   clearRefreshTokenCookie(res);
//   responseHandler(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User logged out successfully',
//     data: {}
//   });
// });

// // Get User Information
// export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.params.id;
//   const user = await User.findById(userId).select('-password');
//   if (!user) throw new AppError('User not found', 404);
//   responseHandler(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User fetched successfully',
//     data: { userId: user._id, email: user.email }
//   });
// });
