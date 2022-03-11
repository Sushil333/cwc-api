import mongoose from 'mongoose';

import StoreStauts from './_helpers/storeStatus.js';

const storeSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    storeAddress: { type: String, required: true },
    aadharCard: { type: String, required: true },
    panCard: { type: String, required: true },
    status: { type: String, default: StoreStauts.Pending },
    storeBanner: { type: String, required: false },
    subscriptionPrice: { type: Number, required: false },
    gstin: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      unique: true,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
