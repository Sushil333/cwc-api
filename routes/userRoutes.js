import express from 'express';

import {
  signin,
  signup,
  getUserProfile,
  getAllManagers,
  deactivateUser,
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
router.get('/get-all-managers', verifyJwt, getAllManagers);
router.post('/deactivate-user', verifyJwt, deactivateUser);

export default router;
