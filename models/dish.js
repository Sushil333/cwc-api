import mongoose from 'mongoose';

const dishSchema = mongoose.Schema(
  {
    dishName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imgKey: { type: String, required: true, trim: true }, // The file key after S3 file upload is done
    imgUrl: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Dish', dishSchema);
