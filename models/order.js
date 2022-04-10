import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    address: { type: String, required: true },
    dishName: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
