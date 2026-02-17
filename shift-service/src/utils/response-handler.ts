import { Response } from 'express';

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export const responseHandler = <T>(res: Response, payload: IApiResponse<T>) => {
  const { statusCode, success, message, data } = payload;
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// use of responseHandler in controller
// responseHandler(res, {
//   statusCode: 200,
//   success: true,
//   message: 'User fetched successfully',
//   data: { userId: user._id, email: user.email }
// });
