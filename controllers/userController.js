import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import Role from '../models/_helpers/role.js';
import generateToken from '../utils/generateToken.js';


// @desc    Auth user & get token
// @route   POST /api/users/signin
// @access  Public
export const signin = async (req, res) => {
  const { email, password } = req.body;

  // parameter validations
  if (!email && !password)
    return res.status(400).json({ message: 'Email and Password is required!' });
  if (!email) return res.status(400).json({ message: 'Email is required!' });
  if (!password)
    return res.status(400).json({ message: 'Password is required!' });

  try {
    // check for user existance
    const oldUser = await User.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    // check for hashed password match
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    // response jwt token
    const token = generateToken({
      id: result._id,
      email: result.email,
      name: result.name,
      imageUrl: result.imageUrl,
      role: result.role
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  // parameter validations
  if (!email && !password)
    return res.status(400).json({ message: 'Email and Password is required!' });
  if (!email) return res.status(400).json({ message: 'Email is required!' });
  if (!password)
    return res.status(400).json({ message: 'Password is required!' });

  try {
    // check for user existance
    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res.status(400).json({ message: 'User already exists' });

    // generate hash for passsword
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user with hashed password
    const result = await User.create({
      email,
      name: `${firstname} ${lastname}`,
      password: hashedPassword,
      role: Role.User,
    });

    // response jwt token
    const token = generateToken({
      id: result._id,
      email: result.email,
      name: result.name,
      imageUrl: result.imageUrl,
      role: result.role
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};


// @desc    Get user profile
// @route   POST /api/users/get-user-profile
// @access  Private
export const getUserProfile = async (req, res) => {
  res.json({
    isLoggedIn: true,
    user: req.user,
  });
};
