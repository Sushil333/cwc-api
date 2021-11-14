import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic_url: { type: String, required: false },
    role: { type: String, required: true },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
