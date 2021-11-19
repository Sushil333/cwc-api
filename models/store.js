import mongoose from 'mongoose';

const storeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    address: { type: String, required: true },
    subPrice: { type: String, required: true },
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
