// import mongoose, { ClientSession, Model } from 'mongoose';
// import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
// import { setRefreshTokenCookie } from '../utils/cookies';
// import { IUser, UserRole } from '../models/userModel';
// import { asyncHandler } from '../utils/async-handler';
// import bcrypt from 'bcryptjs/umd/types';
// import { Customer } from '../models/customerModel';
// import { responseHandler } from '../utils/response-handler';

// interface RegisterWithProfileOptions<TProfile> {
//   role: UserRole;
//   userData: {
//     fullName: string;
//     email: string;
//     password: string;
//     phone?: string;
//   };
//   profileModel: Model<TProfile>;
//   profileData: Omit<TProfile, keyof IUser | '_id'>;
//   res: any;
// }

// export const registerCustomer = asyncHandler(async (req, res) => {
//   const { fullName, email, password, phone, address, customerType } = req.body;

//   const passwordHash = await bcrypt.hash(password, 12);

//   const [customer] = await Customer.create([
//     {
//       fullName,
//       email,
//       password: passwordHash,
//       phone,
//       role: UserRole.CUSTOMER,
//       address,
//       customerType
//     }
//   ]);

//   responseHandler(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Customer registered successfully',
//     data: customer
//   });
// });
