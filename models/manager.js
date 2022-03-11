import mongoose from 'mongoose';
import Role from './_helpers/role.js';

const managerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.Manager },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Manager', managerSchema);
