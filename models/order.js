import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    address: { type: String, required: true },
    dishName: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
