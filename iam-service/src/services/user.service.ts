// import bcrypt from 'bcryptjs';
// import { User, IUser, UserRole } from '../models/userModel';
// import { AppError } from '../utils/error-handler';

// export interface CreateUserInput {
//   fullName: string;
//   email: string;
//   password: string;
//   phone?: string;
//   role: UserRole;
// }

// export async function createUserWithValidation(
//   input: CreateUserInput,
//   session?: any
// ): Promise<IUser> {
//   const { fullName, email, password, phone, role } = input;

//   if (!fullName) throw new AppError('Full name is required', 400);
//   if (!email) throw new AppError('Email is required', 400);
//   if (!password) throw new AppError('Password is required', 400);
//   if (!role) throw new AppError('Role is required', 400);

//   const existingUser = await User.findOne({ email }).session(session || null);
//   if (existingUser) throw new AppError('User already exists', 400);

//   const passwordHash = await bcrypt.hash(password, 12);
//   console.log('user creating ............................');
//   const [user] = await User.create(
//     [
//       {
//         fullName,
//         email,
//         password: passwordHash,
//         phone,
//         role
//       }
//     ],
//     { session }
//   );
//   console.log('Created User:', user);
//   return user;
// }
