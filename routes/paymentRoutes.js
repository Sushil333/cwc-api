import express from 'express';
import { createRazorpayOrders, verifyRazorpayOrders } from '../controllers/payment/paymentController.js';

const router = express.Router();

router.post("/orders", createRazorpayOrders);
router.post("/verify", verifyRazorpayOrders);

export default router;