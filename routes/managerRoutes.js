import express from 'express';

import {
  signin,
  signup,
  getManagerProfile,
  getAllManagers,
  deactivateManager,
} from '../controllers/managerController.js';
import verifyJwt from '../utils/verifyJwt.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

router.get('/get-manager-profile', verifyJwt, getManagerProfile);
router.get('/get-all-managers', verifyJwt, getAllManagers);
router.post('/deactivate-manager', verifyJwt, deactivateManager);

export default router;
