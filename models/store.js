import mongoose from 'mongoose';

const storeSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    storeAddress: { type: String, required: true },
    aadharCard: { type: String, required: true },
    panCard: { type: String, required: true },
    verifed: { type: Boolean, default: false },
    storeBanner: { type: String, required: false },
    subscriptionPrice: { type: Number, required: false },
    gstin: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
