import express from 'express';

import verifyJwt from '../utils/verifyJwt.js';
import { createStore } from '../controllers/storeController.js';

/**
 * @route   POST /api/store/create
 * @desc    Create store
 * @access  Private
 */

const router = express.Router();

// router.get('/', verifyJwt, userStore);
router.post('/create', verifyJwt, createStore);

export default router;
