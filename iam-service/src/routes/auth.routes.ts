// import { Router } from 'express';
// import { body, param } from 'express-validator';
// import {
//   getAuthStatus,
//   signUpUser,
//   loginUser,
//   logoutUser,
//   getUser
// } from '../controllers/auth.controller';
// import { validateRequest } from '../middlewares/validateRequest';
// import {
//   loginValidation,
//   signupValidation,
//   userIdValidation
// } from '../validation/auth.validations';

// const router = Router();

// /**
//  * @route   GET /status
//  * @desc    Check if auth service is up
//  */
// router.get('/status', getAuthStatus);

// /**
//  * @route   POST /signup
//  * @desc    Register new user
//  */
// router.post('/signup', signupValidation, validateRequest, signUpUser);

// /**
//  * @route   POST /login
//  * @desc    Login existing user
//  */
// router.post('/login', loginValidation, validateRequest, loginUser);

// /**
//  * @route   POST /logout
//  * @desc    Logout user
//  */
// router.post('/logout', logoutUser);

// /**
//  * @route   GET /user/:id
//  * @desc    Get user info by ID
//  */
// router.get('/user/:id', userIdValidation, validateRequest, getUser);

// export default router;
