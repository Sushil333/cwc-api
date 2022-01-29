import express from 'express';
import multer from 'multer';

import verifyJwt from '../utils/verifyJwt.js';
import {
  createDish,
  deleteDish,
  createStore,
  getStoreDishes,
  getAllDishes,
} from '../controllers/storeController.js';

/**
 * @route   POST /api/store/create
 * @desc    Create store
 * @access  Private
 */

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// router.get('/', verifyJwt, userStore);
router.post('/create', verifyJwt, createStore);
router.post('/dishes/create', verifyJwt, upload.single('dishImg'), createDish);
router.post('/dishes/delete', verifyJwt, deleteDish);
router.get('/dishes/get-all', verifyJwt, getStoreDishes);
router.get('/dishes', getAllDishes);

export default router;
