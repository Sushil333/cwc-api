import mongoose from 'mongoose';

const storeSchema = mongoose.Schema(
  {
    StoreName: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    storeAddress: { type: String, required: true },
    subscriptionPrice: { type: String, required: true },
    gstin: { type: String, required: false },
    imageUrl: { type: String, required: false },
    verifed: { type: Boolean, default: false, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
