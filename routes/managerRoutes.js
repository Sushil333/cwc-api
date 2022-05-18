import express from 'express';

import {
  signin,
  signup,
  getManagerProfile,
  getAllManagers,
  deactivateManager,
  resetPassword
} from '../controllers/managerController.js';
import verifyJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/reset-password', verifyJwt, resetPassword);
router.get('/get-manager-profile', verifyJwt, getManagerProfile);
router.get('/get-all-managers', verifyJwt, getAllManagers);
router.post('/deactivate-manager', verifyJwt, deactivateManager);

export default router;
