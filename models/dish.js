import mongoose from 'mongoose';

const dishSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Dish', dishSchema);
