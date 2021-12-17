import express from 'express';

import verifyJwt from '../utils/verifyJwt.js';
import { createDish, deleteDish, createStore, getStoreDishes } from '../controllers/storeController.js';

/**
 * @route   POST /api/store/create
 * @desc    Create store
 * @access  Private
 */

const router = express.Router();

// router.get('/', verifyJwt, userStore);
router.post('/create', verifyJwt, createStore);
router.post('/dishes/create', verifyJwt, createDish);
router.post('/dishes/delete', verifyJwt, deleteDish);
router.get('/dishes/get-all', verifyJwt, getStoreDishes);

export default router;
