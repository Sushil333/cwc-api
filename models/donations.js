import mongoose from 'mongoose';

const donationSchema = mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    storeName: { type: String, required: true },
    ngoName: { type: String, required: true },
    qty: { type: Number, derequired: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', donationSchema);
