import mongoose from 'mongoose';

import orderStatus from './_helpers/orderStatus.js';

const orderSchema = mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    address: { type: String, required: true },
    dishName: { type: String, required: true },
    amount: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    status: { type: String, default: orderStatus.Pending },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
