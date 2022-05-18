import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

import Manager from '../models/manager.js';
import Role from '../models/_helpers/role.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/signin
// @access  Public
export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // parameter validations
  if (!email && !password)
    return res.status(400).json({ message: 'Email and Password is required!' });
  if (!email) return res.status(400).json({ message: 'Email is required!' });
  if (!password)
    return res.status(400).json({ message: 'Password is required!' });

  // check for user existance
  const oldUser = await Manager.findOne({ email });
  if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
  if (!oldUser.active) res.status(400).json({ message: 'Account is blocked!' });
  // check for hashed password match
  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  if (!isPasswordCorrect)
    return res.status(400).json({ message: 'Invalid credentials' });

  const resData = {
    id: oldUser._id,
    email: oldUser.email,
    name: oldUser.name,
    role: oldUser.role,
  };
  // response jwt token
  const token = generateToken(resData);
  res.status(200).json({ ...resData, token });
});

// @desc    Auth user & get token
// @route   POST /api/users/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // parameter validations
  if (!email && !password)
    return res.status(400).json({ message: 'Email and Password is required!' });
  if (!email) return res.status(400).json({ message: 'Email is required!' });
  if (!password)
    return res.status(400).json({ message: 'Password is required!' });

  // check for user existance
  const oldUser = await Manager.findOne({ email });
  if (oldUser) return res.status(400).json({ message: 'User already exists' });

  // generate hash for passsword
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new manager with hashed password
  const result = await Manager.create({
    email,
    name: `${firstName} ${lastName}`,
    password: hashedPassword,
    role: Role.Manager,
  });

  const resData = {
    id: result._id,
    email: result.email,
    name: result.name,
  };

  // response jwt token
  const token = generateToken(resData);
  res.status(201).json({ ...resData, token });
});

// @desc    Get user profile
// @route   POST /api/users/get-user-profile
// @access  Private
export const getManagerProfile = async (req, res) => {
  res.json({
    isLoggedIn: true,
    user: req.user,
  });
};

// @desc    Get all managers
// @route   POST /api/users/get-all-managers
// @access  Private
export const getAllManagers = asyncHandler(async (req, res) => {
  if (req.user.role === 'Admin') {
    const allManagers = await Manager.find().sort({ createdAt: -1 });
    res.status(200).json({ allManagers });
  } else res.status(400).json({ message: "You don't have permission" });
});

export const deactivateManager = asyncHandler(async (req, res) => {
  const { id, active } = req.body;
  if (!id) {
    res.status(400).json('ID is required!');
  } else {
    const filter = { _id: id };
    const update = { active: active };
    if (req.user.role === 'Admin') {
      const user = await Manager.findOneAndUpdate(filter, update);
      res.status(200).json({ message: 'Updated Successfully' });
    } else res.status(400).json({ message: "You don't have permission" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Manager.findById(req.user.id);
  if (!user) res.status(400).json({ data: 'User not found!' });

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ data: "password dosn't match!" });
  } else {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.save();
    res.status(200).json({ data: 'Password Updated Successfully' });
  }
});
