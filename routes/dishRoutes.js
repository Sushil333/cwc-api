import express from 'express';

import verifyJwt from '../utils/verifyJwt.js';
import { createDish, getStoreDishes } from '../controllers/dishController.js';

/**
 * @route   POST /api/dish/create
 * @desc    Create dish
 * @access  Private
 */

const router = express.Router();

router.post('/create', verifyJwt, createDish);
router.get('/get-store-dishes', verifyJwt, getStoreDishes);

export default router;
