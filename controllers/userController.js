import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

import User from '../models/user.js';
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
  const oldUser = await User.findOne({ email });
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
    imageUrl: oldUser.imageUrl,
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

  console.log(email, password, firstName, lastName);

  // parameter validations
  if (!email && !password)
    return res.status(400).json({ message: 'Email and Password is required!' });
  if (!email) return res.status(400).json({ message: 'Email is required!' });
  if (!password)
    return res.status(400).json({ message: 'Password is required!' });

  // check for user existance
  const oldUser = await User.findOne({ email });
  if (oldUser) return res.status(400).json({ message: 'User already exists' });

  // generate hash for passsword
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new user with hashed password
  const result = await User.create({
    email,
    name: `${firstName} ${lastName}`,
    password: hashedPassword,
  });

  const resData = {
    id: result._id,
    email: result.email,
    name: result.name,
    imageUrl: result.imageUrl,
  };

  // response jwt token
  const token = generateToken(resData);
  res.status(201).json({ data: token });
});

// @desc    Get user profile
// @route   POST /api/users/get-user-profile
// @access  Private
export const getUserProfile = async (req, res) => {
  res.json({
    isLoggedIn: true,
    user: req.user,
  });
};

export const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
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
