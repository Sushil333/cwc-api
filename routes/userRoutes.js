import express from 'express';

import {
  signin,
  signup,
  getUserProfile,
} from '../controllers/userController.js';
import verifyJwt from '../utils/verifyJwt.js';

/**
 * @route   POST /api/users
 * @desc    List of all users
 * @access  Public
 */

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

router.get('/get-user-profile', verifyJwt, getUserProfile);

export default router;
