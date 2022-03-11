import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

import verifyJwt from '../utils/verifyJwt.js';
import {
  createDish,
  deleteDish,
  createStore,
  getStoreDishes,
  getAllDishes,
  getDishImage,
  storeRequests,
  sendApprovedMail,
  sendRejectioMail
} from '../controllers/storeController.js';

/**
 * @route   POST /api/store/create
 * @desc    Create store
 * @access  Private
 */

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, function (err, raw) {
      cb(
        err,
        err ? undefined : raw.toString('hex') + path.extname(file.originalname)
      );
    });
  },
});

const upload = multer({ storage: storage });

// router.get('/', verifyJwt, userStore);
// store routes
router.post(
  '/create',
  upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'pancard', maxCount: 1 },
  ]),
  createStore
);
router.get('/requests', verifyJwt, storeRequests);
router.get('/send-approved-mail/:id', verifyJwt, sendApprovedMail);
router.post('/send-rejection-mail', verifyJwt, sendRejectioMail);

// store dish routes
router.post('/dishes/create', verifyJwt, upload.single('dishImg'), createDish);
router.post('/dishes/delete', verifyJwt, deleteDish);
router.get('/dishes/get-store-dishes', verifyJwt, getStoreDishes);
router.get('/dishes/get-all-dishes', getAllDishes);
router.get('/dish/image/:key', getDishImage);

export default router;
